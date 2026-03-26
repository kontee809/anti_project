package vn.thuyphominh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RainfallStationDto {
    private String name;
    private Double latitude;
    private Double longitude;
    private String address;
    private Double thresholdWarning;
    private Double thresholdDanger;
    private Double thresholdExtreme;
}
