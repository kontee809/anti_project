package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.RainfallStationDto;
import vn.thuyphominh.backend.entity.*;
import vn.thuyphominh.backend.repository.RainfallHistoryRepository;
import vn.thuyphominh.backend.repository.RainfallStationRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RainfallStationService {

    private final RainfallStationRepository rainfallStationRepository;
    private final RainfallHistoryRepository rainfallHistoryRepository;

    // ---- CRUD ----

    public List<RainfallStation> getAllStations() {
        return rainfallStationRepository.findAllByOrderByLastUpdatedDesc();
    }

    public RainfallStation createStation(RainfallStationDto dto) {
        RainfallStation station = RainfallStation.builder()
                .name(dto.getName())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .address(dto.getAddress())
                .thresholdWarning(dto.getThresholdWarning() != null ? dto.getThresholdWarning() : 7.6)
                .thresholdDanger(dto.getThresholdDanger() != null ? dto.getThresholdDanger() : 50.0)
                .thresholdExtreme(dto.getThresholdExtreme() != null ? dto.getThresholdExtreme() : 100.0)
                .status(RainfallStationStatus.INACTIVE)
                .batteryLevel(100)
                .signalStrength(100)
                .intensity(RainfallIntensity.LIGHT)
                .rainfallCurrent(0.0)
                .rainfall1h(0.0)
                .rainfall3h(0.0)
                .rainfall24h(0.0)
                .build();
        return rainfallStationRepository.save(station);
    }

    public RainfallStation updateStation(Long id, RainfallStationDto dto) {
        RainfallStation station = rainfallStationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rainfall station not found"));
        station.setName(dto.getName());
        station.setLatitude(dto.getLatitude());
        station.setLongitude(dto.getLongitude());
        station.setAddress(dto.getAddress());
        if (dto.getThresholdWarning() != null) station.setThresholdWarning(dto.getThresholdWarning());
        if (dto.getThresholdDanger() != null) station.setThresholdDanger(dto.getThresholdDanger());
        if (dto.getThresholdExtreme() != null) station.setThresholdExtreme(dto.getThresholdExtreme());
        return rainfallStationRepository.save(station);
    }

    public void deleteStation(Long id) {
        rainfallStationRepository.deleteById(id);
    }

    // ---- Data Ingestion ----

    public void ingestData(Long stationId, double rainfallMm) {
        RainfallStation station = rainfallStationRepository.findById(stationId)
                .orElseThrow(() -> new IllegalArgumentException("Rainfall station not found"));

        RainfallIntensity newIntensity = classifyIntensity(rainfallMm);

        station.setRainfallCurrent(rainfallMm);
        station.setRainfall1h(station.getRainfall1h() != null ? station.getRainfall1h() + rainfallMm * 0.1 : rainfallMm);
        station.setRainfall3h(station.getRainfall3h() != null ? station.getRainfall3h() + rainfallMm * 0.05 : rainfallMm);
        station.setRainfall24h(station.getRainfall24h() != null ? station.getRainfall24h() + rainfallMm * 0.01 : rainfallMm);
        station.setIntensity(newIntensity);
        station.setStatus(RainfallStationStatus.ACTIVE);
        station.setLastUpdated(LocalDateTime.now());

        rainfallStationRepository.save(station);

        rainfallHistoryRepository.save(RainfallHistory.builder()
                .stationId(stationId)
                .rainfallMm(rainfallMm)
                .intensity(newIntensity)
                .build());

        if (newIntensity == RainfallIntensity.EXTREME) {
            log.warn("ALERT: Rainfall station {} ({}) is EXTREME — {} mm/h", station.getId(), station.getName(), rainfallMm);
        }
    }

    // ---- History ----

    public List<RainfallHistory> getStationHistory(Long stationId) {
        return rainfallHistoryRepository.findByStationIdOrderByRecordedAtDesc(stationId);
    }

    // ---- Analytics ----

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", rainfallStationRepository.count());
        stats.put("active", rainfallStationRepository.countByStatus(RainfallStationStatus.ACTIVE));
        stats.put("inactive", rainfallStationRepository.countByStatus(RainfallStationStatus.INACTIVE));
        stats.put("maintenance", rainfallStationRepository.countByStatus(RainfallStationStatus.MAINTENANCE));
        stats.put("light", rainfallStationRepository.countByIntensity(RainfallIntensity.LIGHT));
        stats.put("moderate", rainfallStationRepository.countByIntensity(RainfallIntensity.MODERATE));
        stats.put("heavy", rainfallStationRepository.countByIntensity(RainfallIntensity.HEAVY));
        stats.put("extreme", rainfallStationRepository.countByIntensity(RainfallIntensity.EXTREME));
        return stats;
    }

    // ---- Intelligence ----

    public static RainfallIntensity classifyIntensity(double mmPerHour) {
        if (mmPerHour > 50) return RainfallIntensity.EXTREME;
        if (mmPerHour > 7.6) return RainfallIntensity.HEAVY;
        if (mmPerHour >= 2.5) return RainfallIntensity.MODERATE;
        return RainfallIntensity.LIGHT;
    }

    // ---- Offline detection ----

    @Scheduled(fixedRate = 60000)
    public void detectInactiveStations() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        List<RainfallStation> stations = rainfallStationRepository.findAll();
        for (RainfallStation s : stations) {
            if (s.getStatus() == RainfallStationStatus.ACTIVE &&
                    (s.getLastUpdated() == null || s.getLastUpdated().isBefore(cutoff))) {
                s.setStatus(RainfallStationStatus.INACTIVE);
                rainfallStationRepository.save(s);
            }
        }
    }
}
