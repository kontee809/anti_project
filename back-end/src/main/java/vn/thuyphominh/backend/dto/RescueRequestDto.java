package vn.thuyphominh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RescueRequestDto {
    private String name;
    private String phone;
    private String description;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
    private Boolean isForSomeoneElse;
}
