package vn.thuyphominh.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StationStatsResponse {
    private long total;
    private long normal;
    private long warning;
    private long danger;
    private long offline;
}
