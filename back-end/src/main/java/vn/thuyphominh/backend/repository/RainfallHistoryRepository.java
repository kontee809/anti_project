package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.thuyphominh.backend.entity.RainfallHistory;

import java.util.List;

public interface RainfallHistoryRepository extends JpaRepository<RainfallHistory, Long> {
    List<RainfallHistory> findByStationIdOrderByRecordedAtDesc(Long stationId);
}
