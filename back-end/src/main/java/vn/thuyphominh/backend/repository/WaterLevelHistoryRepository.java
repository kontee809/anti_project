package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.thuyphominh.backend.entity.WaterLevelHistory;

import java.util.List;

@Repository
public interface WaterLevelHistoryRepository extends JpaRepository<WaterLevelHistory, Long> {
    List<WaterLevelHistory> findByStationIdOrderByRecordedAtDesc(Long stationId);
}
