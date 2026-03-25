package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.IotWaterLevelRequest;
import vn.thuyphominh.backend.dto.StationStatsResponse;
import vn.thuyphominh.backend.dto.WaterStationDto;
import vn.thuyphominh.backend.entity.WaterLevelHistory;
import vn.thuyphominh.backend.entity.WaterStation;
import vn.thuyphominh.backend.entity.WaterStationStatus;
import vn.thuyphominh.backend.repository.WaterLevelHistoryRepository;
import vn.thuyphominh.backend.repository.WaterStationRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WaterStationService {

    private final WaterStationRepository waterStationRepository;
    private final WaterLevelHistoryRepository waterLevelHistoryRepository;

    public void ingestData(IotWaterLevelRequest req) {
        WaterStation station = waterStationRepository.findById(req.getStationId())
                .orElseThrow(() -> new IllegalArgumentException("Station not found"));

        double level = req.getWaterLevel();
        WaterStationStatus newStatus = WaterStationStatus.NORMAL;
        if (level >= station.getThresholdDanger()) {
            newStatus = WaterStationStatus.DANGER;
            log.warn("ALERT: Station {} ({}) is in DANGER state. Level: {}", station.getId(), station.getName(), level);
        } else if (level >= station.getThresholdWarning()) {
            newStatus = WaterStationStatus.WARNING;
        }

        station.setLastWaterLevel(level);
        station.setStatus(newStatus);
        station.setLastUpdated(LocalDateTime.now());
        waterStationRepository.save(station);

        waterLevelHistoryRepository.save(WaterLevelHistory.builder()
                .stationId(station.getId())
                .waterLevel(level)
                .build());
    }

    public List<WaterStation> getAllStations() {
        return waterStationRepository.findAll();
    }

    public WaterStation createStation(WaterStationDto dto) {
        WaterStation station = WaterStation.builder()
                .name(dto.getName())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .location(dto.getLocation())
                .thresholdWarning(dto.getThresholdWarning())
                .thresholdDanger(dto.getThresholdDanger())
                .status(WaterStationStatus.OFFLINE)
                .build();
        return waterStationRepository.save(station);
    }

    public WaterStation updateStation(Long id, WaterStationDto dto) {
        WaterStation station = waterStationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Station not found"));
        station.setName(dto.getName());
        station.setLatitude(dto.getLatitude());
        station.setLongitude(dto.getLongitude());
        station.setLocation(dto.getLocation());
        station.setThresholdWarning(dto.getThresholdWarning());
        station.setThresholdDanger(dto.getThresholdDanger());
        return waterStationRepository.save(station);
    }

    public void deleteStation(Long id) {
        waterStationRepository.deleteById(id);
    }

    public List<WaterLevelHistory> getStationHistory(Long id) {
        return waterLevelHistoryRepository.findByStationIdOrderByRecordedAtDesc(id);
    }

    public StationStatsResponse getStats() {
        return StationStatsResponse.builder()
                .total(waterStationRepository.count())
                .normal(waterStationRepository.countByStatus(WaterStationStatus.NORMAL))
                .warning(waterStationRepository.countByStatus(WaterStationStatus.WARNING))
                .danger(waterStationRepository.countByStatus(WaterStationStatus.DANGER))
                .offline(waterStationRepository.countByStatus(WaterStationStatus.OFFLINE))
                .build();
    }

    @Scheduled(fixedRate = 60000)
    public void detectOfflineStations() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(15);
        List<WaterStation> stations = waterStationRepository.findAll();
        for (WaterStation s : stations) {
            if (s.getLastUpdated() != null && s.getLastUpdated().isBefore(cutoff) && s.getStatus() != WaterStationStatus.OFFLINE) {
                s.setStatus(WaterStationStatus.OFFLINE);
                waterStationRepository.save(s);
            } else if (s.getLastUpdated() == null && s.getStatus() != WaterStationStatus.OFFLINE) {
                s.setStatus(WaterStationStatus.OFFLINE);
                waterStationRepository.save(s);
            }
        }
    }
}
