package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.thuyphominh.backend.entity.WaterStation;
import vn.thuyphominh.backend.entity.WaterStationStatus;

@Repository
public interface WaterStationRepository extends JpaRepository<WaterStation, Long> {
    long countByStatus(WaterStationStatus status);
}
