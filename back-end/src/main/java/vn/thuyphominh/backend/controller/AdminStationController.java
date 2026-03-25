package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.WaterStationDto;
import vn.thuyphominh.backend.entity.WaterStation;
import vn.thuyphominh.backend.service.WaterStationService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stations")
@RequiredArgsConstructor
public class AdminStationController {

    private final WaterStationService waterStationService;

    @GetMapping
    public ResponseEntity<List<WaterStation>> getAllStations() {
        return ResponseEntity.ok(waterStationService.getAllStations());
    }

    @PostMapping
    public ResponseEntity<WaterStation> createStation(@RequestBody WaterStationDto dto) {
        return ResponseEntity.ok(waterStationService.createStation(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WaterStation> updateStation(@PathVariable Long id, @RequestBody WaterStationDto dto) {
        return ResponseEntity.ok(waterStationService.updateStation(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStation(@PathVariable Long id) {
        waterStationService.deleteStation(id);
        return ResponseEntity.ok().build();
    }
}
