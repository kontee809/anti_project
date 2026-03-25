package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.RescueRequestDto;
import vn.thuyphominh.backend.dto.RescueStatsResponse;
import vn.thuyphominh.backend.entity.RescueRequest;
import vn.thuyphominh.backend.entity.RescueRequestStatus;
import vn.thuyphominh.backend.repository.RescueRequestRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RescueRequestService {

    private final RescueRequestRepository rescueRequestRepository;

    public RescueRequest createRescueRequest(RescueRequestDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (dto.getPhone() == null || dto.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone is required");
        }
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Description is required");
        }
        if (dto.getLatitude() == null || dto.getLongitude() == null) {
            throw new IllegalArgumentException("Coordinates are required");
        }

        RescueRequest rescueRequest = RescueRequest.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .description(dto.getDescription())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .address(dto.getAddress())
                .imageUrl(dto.getImageUrl())
                .isForSomeoneElse(dto.getIsForSomeoneElse() != null ? dto.getIsForSomeoneElse() : false)
                .status(RescueRequestStatus.PENDING)
                .build();

        return rescueRequestRepository.save(rescueRequest);
    }

    public List<RescueRequest> getAllRescueRequests() {
        return rescueRequestRepository.findAll();
    }

    public RescueRequest getRescueRequestById(Long id) {
        return rescueRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rescue request not found: " + id));
    }

    public RescueRequest receiveRequest(Long id) {
        RescueRequest req = getRescueRequestById(id);
        if (req.getStatus() != RescueRequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be received");
        }
        req.setStatus(RescueRequestStatus.RECEIVED);
        return rescueRequestRepository.save(req);
    }

    public RescueRequest assignRequest(Long id, String team) {
        RescueRequest req = getRescueRequestById(id);
        if (req.getStatus() != RescueRequestStatus.RECEIVED) {
            throw new IllegalStateException("Only RECEIVED requests can be assigned");
        }
        req.setStatus(RescueRequestStatus.IN_PROGRESS);
        req.setAssignedTo(team);
        return rescueRequestRepository.save(req);
    }

    public RescueRequest completeRequest(Long id) {
        RescueRequest req = getRescueRequestById(id);
        if (req.getStatus() != RescueRequestStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only IN_PROGRESS requests can be completed");
        }
        req.setStatus(RescueRequestStatus.COMPLETED);
        return rescueRequestRepository.save(req);
    }

    public RescueRequest cancelRequest(Long id) {
        RescueRequest req = getRescueRequestById(id);
        if (req.getStatus() == RescueRequestStatus.COMPLETED || req.getStatus() == RescueRequestStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot cancel an in-progress or completed request");
        }
        req.setStatus(RescueRequestStatus.CANCELLED);
        return rescueRequestRepository.save(req);
    }

    public RescueStatsResponse getStats() {
        return RescueStatsResponse.builder()
                .total(rescueRequestRepository.count())
                .pending(rescueRequestRepository.countByStatus(RescueRequestStatus.PENDING))
                .received(rescueRequestRepository.countByStatus(RescueRequestStatus.RECEIVED))
                .inProgress(rescueRequestRepository.countByStatus(RescueRequestStatus.IN_PROGRESS))
                .completed(rescueRequestRepository.countByStatus(RescueRequestStatus.COMPLETED))
                .cancelled(rescueRequestRepository.countByStatus(RescueRequestStatus.CANCELLED))
                .build();
    }
}
