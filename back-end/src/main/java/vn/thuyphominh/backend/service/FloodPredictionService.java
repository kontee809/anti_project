package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.entity.*;
import vn.thuyphominh.backend.repository.FloodAlertRepository;
import vn.thuyphominh.backend.repository.RainfallStationRepository;
import vn.thuyphominh.backend.repository.WaterStationRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class FloodPredictionService {

    private final FloodAlertRepository floodAlertRepository;
    private final WaterStationRepository waterStationRepository;
    private final RainfallStationRepository rainfallStationRepository;

    // ---- Alert CRUD ----

    public List<FloodAlert> getActiveAlerts() {
        return floodAlertRepository.findByStatusNotOrderByCreatedAtDesc(FloodAlertStatus.RESOLVED);
    }

    public List<FloodAlert> getAllAlerts() {
        return floodAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    public FloodAlert acknowledgeAlert(Long id) {
        FloodAlert alert = floodAlertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
        alert.setStatus(FloodAlertStatus.ACKNOWLEDGED);
        log.info("Alert #{} acknowledged", id);
        return floodAlertRepository.save(alert);
    }

    public FloodAlert resolveAlert(Long id) {
        FloodAlert alert = floodAlertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found"));
        alert.setStatus(FloodAlertStatus.RESOLVED);
        log.info("Alert #{} resolved", id);
        return floodAlertRepository.save(alert);
    }

    public Map<String, Object> getAlertStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", floodAlertRepository.count());
        stats.put("active", floodAlertRepository.countByStatus(FloodAlertStatus.ACTIVE));
        stats.put("acknowledged", floodAlertRepository.countByStatus(FloodAlertStatus.ACKNOWLEDGED));
        stats.put("resolved", floodAlertRepository.countByStatus(FloodAlertStatus.RESOLVED));
        stats.put("low", floodAlertRepository.countByRiskLevel(AlertRiskLevel.LOW));
        stats.put("medium", floodAlertRepository.countByRiskLevel(AlertRiskLevel.MEDIUM));
        stats.put("high", floodAlertRepository.countByRiskLevel(AlertRiskLevel.HIGH));
        stats.put("critical", floodAlertRepository.countByRiskLevel(AlertRiskLevel.CRITICAL));
        return stats;
    }

    // ---- AI Prediction Engine (Simulated) ----

    @Scheduled(fixedRate = 8000)
    public void runPredictionCycle() {
        List<WaterStation> waterStations = waterStationRepository.findAll();
        List<RainfallStation> rainfallStations = rainfallStationRepository.findAll();

        if (waterStations.isEmpty() && rainfallStations.isEmpty()) return;

        // Group stations by proximity (simple: pair each water station with nearest rainfall)
        for (WaterStation ws : waterStations) {
            if (ws.getLastUpdated() == null) continue;
            // Only check stations with recent data (within 15 min)
            if (ws.getLastUpdated().isBefore(LocalDateTime.now().minusMinutes(15))) continue;

            RainfallStation nearestRain = findNearestRainfall(ws, rainfallStations);

            double waterLevel = ws.getLastWaterLevel() != null ? ws.getLastWaterLevel() : 0;
            double rainfallMm = nearestRain != null && nearestRain.getRainfallCurrent() != null
                    ? nearestRain.getRainfallCurrent() : 0;

            // Calculate combined risk
            PredictionResult result = calculateRisk(waterLevel, ws.getThresholdWarning(),
                    ws.getThresholdDanger(), rainfallMm, nearestRain);

            // Only create alert if risk >= MEDIUM
            if (result.riskLevel == AlertRiskLevel.LOW) continue;

            // Check if there's already an active alert nearby (avoid duplicates)
            if (hasRecentAlertNearby(ws.getLatitude(), ws.getLongitude(), 0.5)) continue;

            String rainfallIds = nearestRain != null ? String.valueOf(nearestRain.getId()) : "";
            String waterIds = String.valueOf(ws.getId());

            FloodAlert alert = FloodAlert.builder()
                    .latitude(ws.getLatitude())
                    .longitude(ws.getLongitude())
                    .address(ws.getLocation())
                    .predictedFloodLevelCm(result.predictedLevelCm)
                    .riskLevel(result.riskLevel)
                    .status(FloodAlertStatus.ACTIVE)
                    .confidenceScore(result.confidence)
                    .affectedRadiusKm(result.radiusKm)
                    .predictedTime(LocalDateTime.now().plusMinutes(result.etaMinutes))
                    .rainfallStationIds(rainfallIds)
                    .waterLevelStationIds(waterIds)
                    .inputRainfallMm(rainfallMm)
                    .inputWaterLevelM(waterLevel)
                    .triggerReason(result.reason)
                    .build();

            floodAlertRepository.save(alert);
            log.warn("🚨 FLOOD ALERT #{}: {} at [{}, {}] — Risk: {}, Confidence: {}%, Predicted: {}cm",
                    alert.getId(), result.reason, ws.getLatitude(), ws.getLongitude(),
                    result.riskLevel, result.confidence, result.predictedLevelCm);
        }
    }

    // ---- Risk Calculation Logic ----

    private PredictionResult calculateRisk(double waterLevelM, double thresholdWarning,
                                            double thresholdDanger, double rainfallMm,
                                            RainfallStation rain) {
        PredictionResult r = new PredictionResult();

        // Water level ratio (how close to danger threshold)
        double waterRatio = thresholdDanger > 0 ? waterLevelM / thresholdDanger : 0;

        // Rainfall intensity factor
        double rainFactor = 0;
        if (rainfallMm > 50) rainFactor = 1.0;       // Extreme
        else if (rainfallMm > 7.6) rainFactor = 0.7;  // Heavy
        else if (rainfallMm >= 2.5) rainFactor = 0.4;  // Moderate
        else rainFactor = 0.1;

        // Combined risk score (0-100)
        double riskScore = (waterRatio * 60) + (rainFactor * 40);

        // Factor in sustained rainfall if available
        if (rain != null && rain.getRainfall3h() != null && rain.getRainfall3h() > 20) {
            riskScore += 10;
        }

        riskScore = Math.min(100, riskScore);

        // Classify
        if (riskScore >= 80) {
            r.riskLevel = AlertRiskLevel.CRITICAL;
            r.radiusKm = 2.5;
            r.etaMinutes = 15;
        } else if (riskScore >= 55) {
            r.riskLevel = AlertRiskLevel.HIGH;
            r.radiusKm = 1.5;
            r.etaMinutes = 30;
        } else if (riskScore >= 35) {
            r.riskLevel = AlertRiskLevel.MEDIUM;
            r.radiusKm = 1.0;
            r.etaMinutes = 60;
        } else {
            r.riskLevel = AlertRiskLevel.LOW;
            r.radiusKm = 0.5;
            r.etaMinutes = 120;
        }

        // Predicted flood level (extrapolation)
        r.predictedLevelCm = (int) (waterLevelM * 100 + rainfallMm * 0.5);

        // Confidence score
        r.confidence = calculateConfidence(waterLevelM, rainfallMm, rain);

        // Reason
        List<String> reasons = new ArrayList<>();
        if (waterRatio >= 0.8) reasons.add("Mực nước gần ngưỡng nguy hiểm");
        if (waterRatio >= 1.0) reasons.add("Mực nước VƯỢT ngưỡng");
        if (rainfallMm > 50) reasons.add("Mưa cực đoan (" + String.format("%.1f", rainfallMm) + "mm/h)");
        else if (rainfallMm > 7.6) reasons.add("Mưa nặng (" + String.format("%.1f", rainfallMm) + "mm/h)");
        if (rain != null && rain.getRainfall3h() != null && rain.getRainfall3h() > 20)
            reasons.add("Mưa kéo dài 3h");
        r.reason = reasons.isEmpty() ? "Phát hiện nguy cơ ngập" : String.join(" + ", reasons);

        return r;
    }

    private int calculateConfidence(double waterLevel, double rainfallMm, RainfallStation rain) {
        int conf = 40; // base
        if (waterLevel > 0) conf += 20;
        if (rainfallMm > 0) conf += 15;
        if (rain != null && rain.getRainfall1h() != null && rain.getRainfall1h() > 5) conf += 10;
        if (rain != null && rain.getLastUpdated() != null &&
                rain.getLastUpdated().isAfter(LocalDateTime.now().minusMinutes(5))) conf += 10;
        return Math.min(95, conf);
    }

    // ---- Helpers ----

    private RainfallStation findNearestRainfall(WaterStation ws, List<RainfallStation> stations) {
        return stations.stream()
                .filter(r -> r.getLastUpdated() != null)
                .min(Comparator.comparingDouble(r ->
                        haversine(ws.getLatitude(), ws.getLongitude(), r.getLatitude(), r.getLongitude())))
                .orElse(null);
    }

    private boolean hasRecentAlertNearby(double lat, double lng, double radiusKm) {
        List<FloodAlert> active = floodAlertRepository.findByStatus(FloodAlertStatus.ACTIVE);
        return active.stream().anyMatch(a ->
                haversine(lat, lng, a.getLatitude(), a.getLongitude()) < radiusKm &&
                        a.getCreatedAt() != null &&
                        a.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(3))
        );
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ---- System Status ----

    public Map<String, Object> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();
        long wsCount = waterStationRepository.count();
        long rsCount = rainfallStationRepository.count();
        long wsOnline = waterStationRepository.findAll().stream()
                .filter(s -> s.getLastUpdated() != null && s.getLastUpdated().isAfter(LocalDateTime.now().minusMinutes(15)))
                .count();
        long rsOnline = rainfallStationRepository.findAll().stream()
                .filter(s -> s.getStatus() == RainfallStationStatus.ACTIVE)
                .count();

        status.put("waterStationsTotal", wsCount);
        status.put("waterStationsOnline", wsOnline);
        status.put("rainfallStationsTotal", rsCount);
        status.put("rainfallStationsOnline", rsOnline);
        status.put("alertsActive", floodAlertRepository.countByStatus(FloodAlertStatus.ACTIVE));
        status.put("systemHealthy", wsOnline > 0 || rsOnline > 0);
        status.put("lastCheck", LocalDateTime.now());
        return status;
    }

    private static class PredictionResult {
        AlertRiskLevel riskLevel;
        int predictedLevelCm;
        int confidence;
        double radiusKm;
        int etaMinutes;
        String reason;
    }
}
