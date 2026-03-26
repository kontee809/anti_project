package vn.thuyphominh.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.thuyphominh.backend.dto.FloodReportRequest;
import vn.thuyphominh.backend.entity.*;
import vn.thuyphominh.backend.repository.FloodReportRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FloodReportService {

    private final FloodReportRepository floodReportRepository;

    public FloodReport createReport(FloodReportRequest req, Long userId) {
        SeverityLevel severity = classifySeverity(req.getFloodLevelCm());
        ReportSource source = parseSource(req.getReportedBy());
        int reliability = calculateReliability(req, source);

        FloodReport report = FloodReport.builder()
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .address(req.getAddress())
                .floodLevelCm(req.getFloodLevelCm())
                .severityLevel(severity)
                .floodType(parseFloodType(req.getFloodType()))
                .description(req.getDescription())
                .durationEstimate(req.getDurationEstimate())
                .imageUrl(req.getImageUrl())
                .reportedBy(source)
                .reliabilityScore(reliability)
                .status(FloodReportStatus.PENDING)
                .userId(userId)
                .build();

        FloodReport saved = floodReportRepository.save(report);
        log.info("Created flood report #{} — severity: {}, reliability: {}", saved.getId(), severity, reliability);
        return saved;
    }

    public List<FloodReport> getActiveReports() {
        return floodReportRepository.findByStatusNotOrderByCreatedAtDesc(FloodReportStatus.RESOLVED);
    }

    public List<FloodReport> getAllReports() {
        return floodReportRepository.findAll();
    }

    public List<FloodReport> getNearbyReports(double lat, double lng, double radiusKm) {
        return floodReportRepository.findNearby(lat, lng, radiusKm);
    }

    public FloodReport updateStatus(Long id, String newStatus) {
        FloodReport report = floodReportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Flood report not found"));
        report.setStatus(FloodReportStatus.valueOf(newStatus.toUpperCase()));
        return floodReportRepository.save(report);
    }

    // ---- Intelligence Logic ----

    private SeverityLevel classifySeverity(int levelCm) {
        if (levelCm > 100) return SeverityLevel.CRITICAL;
        if (levelCm > 50) return SeverityLevel.HIGH;
        if (levelCm >= 20) return SeverityLevel.MEDIUM;
        return SeverityLevel.LOW;
    }

    private int calculateReliability(FloodReportRequest req, ReportSource source) {
        int score = 30; // base score

        // Source bonus
        if (source == ReportSource.SENSOR) score += 40;
        else if (source == ReportSource.SYSTEM) score += 35;
        else score += 15; // USER

        // Has image bonus
        if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) score += 15;

        // Has description bonus
        if (req.getDescription() != null && req.getDescription().length() > 20) score += 10;

        // Has address bonus
        if (req.getAddress() != null && !req.getAddress().isBlank()) score += 5;

        return Math.min(100, score);
    }

    private ReportSource parseSource(String source) {
        if (source == null) return ReportSource.USER;
        try {
            return ReportSource.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ReportSource.USER;
        }
    }

    private FloodType parseFloodType(String type) {
        if (type == null) return FloodType.URBAN;
        try {
            return FloodType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return FloodType.URBAN;
        }
    }
}
