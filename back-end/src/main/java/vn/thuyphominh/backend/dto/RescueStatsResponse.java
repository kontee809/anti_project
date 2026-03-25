package vn.thuyphominh.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RescueStatsResponse {
    private long total;
    private long pending;
    private long received;
    private long inProgress;
    private long completed;
    private long cancelled;
}
