package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.AssignTeamRequest;
import vn.thuyphominh.backend.dto.RescueStatsResponse;
import vn.thuyphominh.backend.entity.RescueRequest;
import vn.thuyphominh.backend.service.RescueRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rescue")
@RequiredArgsConstructor
public class AdminRescueController {

    private final RescueRequestService rescueRequestService;

    @GetMapping
    public ResponseEntity<List<RescueRequest>> getAllRescueRequests() {
        return ResponseEntity.ok(rescueRequestService.getAllRescueRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RescueRequest> getRescueRequest(@PathVariable Long id) {
        return ResponseEntity.ok(rescueRequestService.getRescueRequestById(id));
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<RescueRequest> receiveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(rescueRequestService.receiveRequest(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<RescueRequest> assignRequest(@PathVariable Long id, @RequestBody AssignTeamRequest req) {
        return ResponseEntity.ok(rescueRequestService.assignRequest(id, req.getAssignedTo()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<RescueRequest> completeRequest(@PathVariable Long id) {
        return ResponseEntity.ok(rescueRequestService.completeRequest(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<RescueRequest> cancelRequest(@PathVariable Long id) {
        return ResponseEntity.ok(rescueRequestService.cancelRequest(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<RescueStatsResponse> getStats() {
        return ResponseEntity.ok(rescueRequestService.getStats());
    }
}
