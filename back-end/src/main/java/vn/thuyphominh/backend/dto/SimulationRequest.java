package vn.thuyphominh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationRequest {
    private Long stationId;
    private String mode; // AUTO | MANUAL | RANDOM
    private Double value; // only used in MANUAL
    private Integer duration; // seconds (for AUTO/RANDOM testing intervals, or total duration)
}
