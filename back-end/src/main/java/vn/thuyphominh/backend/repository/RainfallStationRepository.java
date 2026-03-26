package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.thuyphominh.backend.entity.RainfallStation;
import vn.thuyphominh.backend.entity.RainfallStationStatus;
import vn.thuyphominh.backend.entity.RainfallIntensity;

import java.util.List;

public interface RainfallStationRepository extends JpaRepository<RainfallStation, Long> {
    long countByStatus(RainfallStationStatus status);
    long countByIntensity(RainfallIntensity intensity);
    List<RainfallStation> findAllByOrderByLastUpdatedDesc();
}
