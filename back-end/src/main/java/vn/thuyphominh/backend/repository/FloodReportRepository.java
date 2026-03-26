package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.thuyphominh.backend.entity.FloodReport;
import vn.thuyphominh.backend.entity.FloodReportStatus;

import java.util.List;

public interface FloodReportRepository extends JpaRepository<FloodReport, Long> {

    List<FloodReport> findByStatusNot(FloodReportStatus status);

    List<FloodReport> findByStatusNotOrderByCreatedAtDesc(FloodReportStatus status);

    @Query(value = "SELECT *, " +
            "(6371 * ACOS(COS(RADIANS(:lat)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(:lng)) + SIN(RADIANS(:lat)) * SIN(RADIANS(latitude)))) AS distance " +
            "FROM flood_reports " +
            "WHERE status <> 'RESOLVED' " +
            "HAVING distance < :radiusKm " +
            "ORDER BY distance", nativeQuery = true)
    List<FloodReport> findNearby(@Param("lat") double lat, @Param("lng") double lng, @Param("radiusKm") double radiusKm);
}
