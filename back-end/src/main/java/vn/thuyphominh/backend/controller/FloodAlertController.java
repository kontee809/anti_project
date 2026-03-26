package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.entity.FloodAlert;
import vn.thuyphominh.backend.service.FloodPredictionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flood-alerts")
@RequiredArgsConstructor
public class FloodAlertController {

    private final FloodPredictionService floodPredictionService;

    // Public: get active alerts (for map display)
    @GetMapping
    public ResponseEntity<List<FloodAlert>> getActiveAlerts() {
        return ResponseEntity.ok(floodPredictionService.getActiveAlerts());
    }

    @GetMapping("/system-status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        return ResponseEntity.ok(floodPredictionService.getSystemStatus());
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FloodAlert>> getAllAlerts() {
        return ResponseEntity.ok(floodPredictionService.getAllAlerts());
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(floodPredictionService.getAlertStats());
    }

    @PutMapping("/admin/{id}/acknowledge")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FloodAlert> acknowledge(@PathVariable Long id) {
        return ResponseEntity.ok(floodPredictionService.acknowledgeAlert(id));
    }

    @PutMapping("/admin/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FloodAlert> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(floodPredictionService.resolveAlert(id));
    }
}
