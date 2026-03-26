package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.SimulationRequest;
import vn.thuyphominh.backend.service.SimulationService;

@RestController
@RequestMapping("/api/dev/water")
@RequiredArgsConstructor
public class DevController {

    private final SimulationService simulationService;

    @PostMapping("/simulate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> simulate(@RequestBody SimulationRequest request) {
        simulationService.simulate(request);
        return ResponseEntity.ok("Simulation started for station " + request.getStationId() + " in " + request.getMode() + " mode.");
    }

    @PostMapping("/stop/{stationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> stopSimulation(@PathVariable Long stationId) {
        simulationService.stop(stationId);
        return ResponseEntity.ok("Simulation stopped for station " + stationId);
    }
}
