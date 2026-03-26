package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.FloodReportRequest;
import vn.thuyphominh.backend.entity.FloodReport;
import vn.thuyphominh.backend.entity.User;
import vn.thuyphominh.backend.service.FloodReportService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flood-reports")
@RequiredArgsConstructor
public class FloodReportController {

    private final FloodReportService floodReportService;

    @PostMapping
    public ResponseEntity<FloodReport> createReport(@RequestBody FloodReportRequest request, Authentication authentication) {
        Long userId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            userId = user.getId();
        }
        FloodReport report = floodReportService.createReport(request, userId);
        return ResponseEntity.ok(report);
    }

    @GetMapping
    public ResponseEntity<List<FloodReport>> getActiveReports() {
        return ResponseEntity.ok(floodReportService.getActiveReports());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FloodReport>> getAllReports() {
        return ResponseEntity.ok(floodReportService.getAllReports());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<FloodReport>> getNearbyReports(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius
    ) {
        return ResponseEntity.ok(floodReportService.getNearbyReports(lat, lng, radius));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FloodReport> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        return ResponseEntity.ok(floodReportService.updateStatus(id, newStatus));
    }
}
