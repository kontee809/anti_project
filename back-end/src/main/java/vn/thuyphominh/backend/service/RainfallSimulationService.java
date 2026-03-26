package vn.thuyphominh.backend.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.entity.RainfallStation;
import vn.thuyphominh.backend.repository.RainfallStationRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class RainfallSimulationService {

    private final RainfallStationService rainfallStationService;
    private final RainfallStationRepository rainfallStationRepository;
    private final Map<Long, RainSimInfo> activeSimulations = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public void simulate(Long stationId, String mode, Integer duration) {
        rainfallStationRepository.findById(stationId)
                .orElseThrow(() -> new IllegalArgumentException("Rainfall station not found"));

        if ("MANUAL".equalsIgnoreCase(mode)) {
            // Instant random push
            double val = 1.0 + random.nextDouble() * 80;
            rainfallStationService.ingestData(stationId, val);
            log.info("Manual rainfall sim for station {}: {} mm", stationId, val);
            return;
        }

        RainSimInfo info = new RainSimInfo();
        info.setMode(mode != null ? mode.toUpperCase() : "RANDOM");
        info.setStartTime(LocalDateTime.now());
        info.setDuration(duration != null ? duration : 60);
        info.setCurrentIntensity(2.0 + random.nextDouble() * 5);
        info.setIncreasing(true);

        activeSimulations.put(stationId, info);
        log.info("Started {} rainfall simulation for station {}", info.getMode(), stationId);
    }

    public void stop(Long stationId) {
        activeSimulations.remove(stationId);
        log.info("Stopped rainfall simulation for station {}", stationId);
    }

    @Scheduled(fixedRate = 3000)
    public void processSimulations() {
        if (activeSimulations.isEmpty()) return;

        LocalDateTime now = LocalDateTime.now();
        activeSimulations.entrySet().removeIf(e ->
                now.isAfter(e.getValue().getStartTime().plusSeconds(e.getValue().getDuration())));

        for (Map.Entry<Long, RainSimInfo> entry : activeSimulations.entrySet()) {
            Long stationId = entry.getKey();
            RainSimInfo info = entry.getValue();

            double val;
            if ("RANDOM".equals(info.getMode())) {
                val = 0.5 + random.nextDouble() * 70; // 0.5 to 70.5 mm/h
            } else {
                // STORM mode: rising and falling
                val = info.getCurrentIntensity();
                if (info.isIncreasing()) {
                    val += 2.0 + random.nextDouble() * 8.0;
                    if (val >= 80.0) info.setIncreasing(false);
                } else {
                    val -= 1.0 + random.nextDouble() * 5.0;
                    if (val <= 1.0) {
                        val = 1.0;
                        info.setIncreasing(true);
                    }
                }
                info.setCurrentIntensity(val);
            }

            // Simulate battery/signal degradation
            try {
                RainfallStation station = rainfallStationRepository.findById(stationId).orElse(null);
                if (station != null) {
                    int bat = station.getBatteryLevel() != null ? station.getBatteryLevel() : 100;
                    int sig = station.getSignalStrength() != null ? station.getSignalStrength() : 100;
                    station.setBatteryLevel(Math.max(5, bat - random.nextInt(2)));
                    station.setSignalStrength(Math.max(10, sig - random.nextInt(3) + random.nextInt(2)));
                    rainfallStationRepository.save(station);
                }
            } catch (Exception e) { /* ignore */ }

            rainfallStationService.ingestData(stationId, val);
        }
    }

    @Data
    private static class RainSimInfo {
        private String mode;
        private Double currentIntensity;
        private boolean increasing;
        private LocalDateTime startTime;
        private Integer duration;
    }
}
