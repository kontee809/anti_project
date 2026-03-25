package vn.thuyphominh.backend.dto;

import lombok.Data;

@Data
public class WaterStationDto {
    private String name;
    private Double latitude;
    private Double longitude;
    private String location;
    private Double thresholdWarning;
    private Double thresholdDanger;
}
