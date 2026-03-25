package vn.thuyphominh.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "water_stations")
public class WaterStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WaterStationStatus status;

    private Double lastWaterLevel;

    private LocalDateTime lastUpdated;

    @Column(nullable = false)
    private Double thresholdWarning;

    @Column(nullable = false)
    private Double thresholdDanger;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
