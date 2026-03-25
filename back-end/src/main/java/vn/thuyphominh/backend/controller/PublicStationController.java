package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.StationStatsResponse;
import vn.thuyphominh.backend.entity.WaterLevelHistory;
import vn.thuyphominh.backend.entity.WaterStation;
import vn.thuyphominh.backend.service.WaterStationService;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class PublicStationController {

    private final WaterStationService waterStationService;

    @GetMapping
    public ResponseEntity<List<WaterStation>> getStations() {
        return ResponseEntity.ok(waterStationService.getAllStations());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<WaterLevelHistory>> getStationHistory(@PathVariable Long id) {
        return ResponseEntity.ok(waterStationService.getStationHistory(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<StationStatsResponse> getPublicStats() {
        return ResponseEntity.ok(waterStationService.getStats());
    }
}
