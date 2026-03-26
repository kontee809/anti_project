package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.RainfallStationDto;
import vn.thuyphominh.backend.entity.RainfallStation;
import vn.thuyphominh.backend.entity.RainfallHistory;
import vn.thuyphominh.backend.service.RainfallStationService;
import vn.thuyphominh.backend.service.RainfallSimulationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rainfall-stations")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminRainfallStationController {

    private final RainfallStationService rainfallStationService;
    private final RainfallSimulationService rainfallSimulationService;

    @GetMapping
    public ResponseEntity<List<RainfallStation>> getAll() {
        return ResponseEntity.ok(rainfallStationService.getAllStations());
    }

    @PostMapping
    public ResponseEntity<RainfallStation> create(@RequestBody RainfallStationDto dto) {
        return ResponseEntity.ok(rainfallStationService.createStation(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RainfallStation> update(@PathVariable Long id, @RequestBody RainfallStationDto dto) {
        return ResponseEntity.ok(rainfallStationService.updateStation(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rainfallStationService.deleteStation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<RainfallHistory>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(rainfallStationService.getStationHistory(id));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(rainfallStationService.getStats());
    }

    // Simulation endpoints
    @PostMapping("/simulate")
    public ResponseEntity<String> simulate(@RequestBody Map<String, Object> body) {
        Long stationId = Long.parseLong(body.get("stationId").toString());
        String mode = body.getOrDefault("mode", "RANDOM").toString();
        Integer duration = body.containsKey("duration") ? Integer.parseInt(body.get("duration").toString()) : 60;
        rainfallSimulationService.simulate(stationId, mode, duration);
        return ResponseEntity.ok("Simulation started");
    }

    @PostMapping("/simulate/stop/{id}")
    public ResponseEntity<String> stopSimulation(@PathVariable Long id) {
        rainfallSimulationService.stop(id);
        return ResponseEntity.ok("Simulation stopped");
    }
}
