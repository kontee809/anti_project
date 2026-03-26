package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.entity.RainfallStation;
import vn.thuyphominh.backend.entity.RainfallHistory;
import vn.thuyphominh.backend.service.RainfallStationService;

import java.util.List;

@RestController
@RequestMapping("/api/rainfall-stations")
@RequiredArgsConstructor
public class PublicRainfallStationController {

    private final RainfallStationService rainfallStationService;

    @GetMapping
    public ResponseEntity<List<RainfallStation>> getAll() {
        return ResponseEntity.ok(rainfallStationService.getAllStations());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<RainfallHistory>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(rainfallStationService.getStationHistory(id));
    }
}
