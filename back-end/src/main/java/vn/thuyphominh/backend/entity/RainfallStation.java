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
@Table(name = "rainfall_stations")
public class RainfallStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RainfallStationStatus status;

    private Double rainfallCurrent;   // mm - current reading
    private Double rainfall1h;        // mm - last 1 hour
    private Double rainfall3h;        // mm - last 3 hours
    private Double rainfall24h;       // mm - last 24 hours

    @Enumerated(EnumType.STRING)
    private RainfallIntensity intensity;

    private Integer batteryLevel;     // 0-100%
    private Integer signalStrength;   // 0-100%

    private LocalDateTime lastUpdated;

    @Column(nullable = false)
    private Double thresholdWarning;  // mm/h

    @Column(nullable = false)
    private Double thresholdDanger;   // mm/h

    @Column(nullable = false)
    private Double thresholdExtreme;  // mm/h

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
