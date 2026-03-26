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
@Table(name = "flood_reports")
public class FloodReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    private Integer floodLevelCm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeverityLevel severityLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FloodType floodType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String durationEstimate;

    @Column(length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportSource reportedBy;

    @Column(nullable = false)
    private Integer reliabilityScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FloodReportStatus status;

    private Long userId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
