package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.IotWaterLevelRequest;
import vn.thuyphominh.backend.service.WaterStationService;

@RestController
@RequestMapping("/api/iot")
@RequiredArgsConstructor
public class IotController {

    private final WaterStationService waterStationService;

    @PostMapping("/water-level")
    public ResponseEntity<String> receiveWaterLevel(@RequestBody IotWaterLevelRequest req) {
        waterStationService.ingestData(req);
        return ResponseEntity.ok("Data accepted");
    }
}
