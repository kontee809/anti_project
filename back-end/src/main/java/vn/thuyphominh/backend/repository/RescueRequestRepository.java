package vn.thuyphominh.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.thuyphominh.backend.entity.RescueRequest;
import vn.thuyphominh.backend.entity.RescueRequestStatus;

@Repository
public interface RescueRequestRepository extends JpaRepository<RescueRequest, Long> {
    long countByStatus(RescueRequestStatus status);
}
