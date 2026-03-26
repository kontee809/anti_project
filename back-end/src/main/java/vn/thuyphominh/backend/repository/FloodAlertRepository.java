package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.thuyphominh.backend.entity.FloodAlert;
import vn.thuyphominh.backend.entity.FloodAlertStatus;
import vn.thuyphominh.backend.entity.AlertRiskLevel;

import java.util.List;

public interface FloodAlertRepository extends JpaRepository<FloodAlert, Long> {
    List<FloodAlert> findByStatusNotOrderByCreatedAtDesc(FloodAlertStatus status);
    List<FloodAlert> findAllByOrderByCreatedAtDesc();
    long countByStatus(FloodAlertStatus status);
    long countByRiskLevel(AlertRiskLevel riskLevel);
    List<FloodAlert> findByStatus(FloodAlertStatus status);
}
