package com.zyane.gt.domain;
import jakarta.persistence.*; import java.time.Instant;
@Entity @Table(name="audit_logs")
public class AuditLog {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @Column(nullable=false) private String userId, action, entityType, entityId, ipAddress;
    @Column(columnDefinition="text") private String oldData, newData;
    private Instant timestamp = Instant.now();
    // getters/setters
}
