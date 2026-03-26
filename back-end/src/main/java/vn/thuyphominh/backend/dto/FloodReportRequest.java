package vn.thuyphominh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FloodReportRequest {
    private Double latitude;
    private Double longitude;
    private String address;
    private Integer floodLevelCm;
    private String floodType;      // URBAN | RIVER | FLASH_FLOOD
    private String description;
    private String durationEstimate;
    private String imageUrl;
    private String reportedBy;     // USER | SENSOR | SYSTEM
}
