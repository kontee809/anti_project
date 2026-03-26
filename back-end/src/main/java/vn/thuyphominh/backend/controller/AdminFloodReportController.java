package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.entity.FloodReport;
import vn.thuyphominh.backend.service.FloodReportService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/flood-reports")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminFloodReportController {

    private final FloodReportService floodReportService;

    @GetMapping
    public ResponseEntity<List<FloodReport>> getAllReports() {
        return ResponseEntity.ok(floodReportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FloodReport> getReport(@PathVariable Long id) {
        return ResponseEntity.ok(floodReportService.getAllReports().stream()
                .filter(r -> r.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Report not found")));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(floodReportService.getAnalytics());
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<FloodReport> verify(@PathVariable Long id) {
        return ResponseEntity.ok(floodReportService.verifyReport(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<FloodReport> reject(@PathVariable Long id) {
        return ResponseEntity.ok(floodReportService.rejectReport(id));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<FloodReport> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(floodReportService.resolveReport(id));
    }
}
