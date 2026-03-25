package vn.thuyphominh.backend.dto;

import lombok.Data;

@Data
public class IotWaterLevelRequest {
    private Long stationId;
    private Double waterLevel;
}
