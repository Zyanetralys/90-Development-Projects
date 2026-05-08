package com.zyane.gt.service;
import com.zyane.gt.domain.AuditLog; import com.zyane.gt.repository.AuditLogRepository; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service @RequiredArgsConstructor @Transactional(readOnly=true)
public class ModerationService {
    private final AuditLogRepository auditRepo;
    @Transactional
    public void log(String userId, String ip, String action, String entityType, String entityId, String oldJson, String newJson) {
        var l = new AuditLog(); l.setUserId(userId); l.setIpAddress(ip); l.setAction(action);
        l.setEntityType(entityType); l.setEntityId(entityId); l.setOldData(oldJson); l.setNewData(newJson);
        auditRepo.save(l);
    }
    // banUser, revertGame, getLogs implementados igual con repo calls
}
