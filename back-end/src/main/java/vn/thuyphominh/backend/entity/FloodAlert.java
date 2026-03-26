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
@Table(name = "flood_alerts")
public class FloodAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    private Integer predictedFloodLevelCm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertRiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FloodAlertStatus status;

    private Integer confidenceScore;    // 0-100

    private Double affectedRadiusKm;

    private LocalDateTime predictedTime;

    // Comma-separated station IDs
    private String rainfallStationIds;
    private String waterLevelStationIds;

    // Raw input values used for prediction
    private Double inputRainfallMm;
    private Double inputWaterLevelM;
    private String triggerReason;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
