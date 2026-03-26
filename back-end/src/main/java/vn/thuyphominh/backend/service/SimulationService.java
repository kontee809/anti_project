package vn.thuyphominh.backend.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.IotWaterLevelRequest;
import vn.thuyphominh.backend.dto.SimulationRequest;
import vn.thuyphominh.backend.entity.WaterStation;
import vn.thuyphominh.backend.repository.WaterStationRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class SimulationService {

    private final WaterStationService waterStationService;
    private final WaterStationRepository waterStationRepository;
    private final Map<Long, SimulationInfo> activeSimulations = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public void simulate(SimulationRequest req) {
        Long stationId = req.getStationId();
        
        if ("MANUAL".equalsIgnoreCase(req.getMode())) {
            // Instant update
            pushData(stationId, req.getValue() != null ? req.getValue() : 0.0);
            stop(stationId); // Ensure it's not active in scheduled tasks
            log.info("Manual simulation for station {}: level {}", stationId, req.getValue());
            return;
        }

        WaterStation station = waterStationRepository.findById(stationId)
                .orElseThrow(() -> new IllegalArgumentException("Station not found"));

        SimulationInfo info = new SimulationInfo();
        info.setMode(req.getMode() != null ? req.getMode().toUpperCase() : "RANDOM");
        info.setStartTime(LocalDateTime.now());
        info.setDuration(req.getDuration() != null ? req.getDuration() : 60); // default 60s
        info.setMaxThreshold(station.getThresholdDanger() + Math.max(10.0, station.getThresholdDanger() * 0.1));

        if ("AUTO".equalsIgnoreCase(info.getMode())) {
            info.setCurrentLevel(Math.max(10.0, station.getThresholdWarning() - 30.0)); // start low
            info.setIncreasing(true);
        }

        activeSimulations.put(stationId, info);
        log.info("Started {} simulation for station {}", info.getMode(), stationId);
    }

    public void stop(Long stationId) {
        activeSimulations.remove(stationId);
        log.info("Stopped simulation for station {}", stationId);
    }

    @Scheduled(fixedRate = 2000)
    public void processSimulations() {
        if (activeSimulations.isEmpty()) return;

        LocalDateTime now = LocalDateTime.now();
        // Remove expired simulations
        activeSimulations.entrySet().removeIf(entry -> 
            now.isAfter(entry.getValue().getStartTime().plusSeconds(entry.getValue().getDuration()))
        );

        for (Map.Entry<Long, SimulationInfo> entry : activeSimulations.entrySet()) {
            Long stationId = entry.getKey();
            SimulationInfo info = entry.getValue();

            double newValue = 0.0;

            if ("RANDOM".equals(info.getMode())) {
                newValue = 10.0 + (110.0 * random.nextDouble()); // 10 to 120
            } else if ("AUTO".equals(info.getMode())) {
                newValue = info.getCurrentLevel();
                if (info.isIncreasing()) {
                    newValue += (1.0 + random.nextDouble() * 3.0); // + 1 to 4 cm (or m, relative to threshold)
                    if (newValue >= info.getMaxThreshold()) {
                        info.setIncreasing(false);
                    }
                } else {
                    newValue -= (1.0 + random.nextDouble() * 3.0); // - 1 to 4
                    if (newValue <= 10.0) {
                        info.setIncreasing(true);
                    }
                }
                info.setCurrentLevel(newValue);
            }

            pushData(stationId, newValue);
        }
    }

    private void pushData(Long stationId, double value) {
        IotWaterLevelRequest req = new IotWaterLevelRequest();
        req.setStationId(stationId);
        req.setWaterLevel(value);
        try {
            waterStationService.ingestData(req);
        } catch (Exception e) {
            log.error("Failed to push simulated data for station {}: {}", stationId, e.getMessage());
        }
    }

    @Data
    private static class SimulationInfo {
        private String mode;
        private Double currentLevel;
        private boolean increasing;
        private LocalDateTime startTime;
        private Integer duration;
        private Double maxThreshold;
    }
}
