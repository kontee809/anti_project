package vn.thuyphominh.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.thuyphominh.backend.dto.RescueRequestDto;
import vn.thuyphominh.backend.entity.RescueRequest;
import vn.thuyphominh.backend.service.RescueRequestService;

import java.util.List;

@RestController
@RequestMapping("/api/rescue")
@RequiredArgsConstructor
public class RescueRequestController {

    private final RescueRequestService rescueRequestService;

    @PostMapping
    public ResponseEntity<RescueRequest> createRescueRequest(@RequestBody RescueRequestDto dto) {
        return ResponseEntity.ok(rescueRequestService.createRescueRequest(dto));
    }

    @GetMapping
    public ResponseEntity<List<RescueRequest>> getAllRescueRequests() {
        return ResponseEntity.ok(rescueRequestService.getAllRescueRequests());
    }
}
