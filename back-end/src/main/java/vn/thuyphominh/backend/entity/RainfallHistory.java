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
@Table(name = "rainfall_history")
public class RainfallHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long stationId;

    private Double rainfallMm;

    @Enumerated(EnumType.STRING)
    private RainfallIntensity intensity;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime recordedAt;
}
