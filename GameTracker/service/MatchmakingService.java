package com.zyane.gt.service;
import lombok.RequiredArgsConstructor; import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate; import org.springframework.messaging.simp.SimpMessagingTemplate; import org.springframework.stereotype.Service;
import java.util.*;

@Service @Slf4j @RequiredArgsConstructor
public class MatchmakingService {
    private final StringRedisTemplate redis;
    private final SimpMessagingTemplate ws;
    private static final String QUEUE = "match:queue";

    public void join(String userId, double elo) {
        redis.opsForZSet().add(QUEUE, userId, elo);
        attemptMatch();
    }
    public void leave(String userId) { redis.opsForZSet().remove(QUEUE, userId); }

    private void attemptMatch() {
        Long count = redis.opsForZSet().zCard(QUEUE);
        if (count != null && count >= 2) {
            var players = redis.opsForZSet().range(QUEUE, 0, 1);
            if (players != null && players.size() == 2) {
                String[] arr = players.toArray(String[]::new);
                redis.opsForZSet().remove(QUEUE, arr);
                ws.convertAndSendToUser(arr[0], "/queue/match", Map.of("opponent", arr[1]));
                ws.convertAndSendToUser(arr[1], "/queue/match", Map.of("opponent", arr[0]));
            }
        }
    }

    public void updateElo(String winner, String loser, int k) {
        double w = redis.opsForZSet().score(QUEUE, winner) != null ? redis.opsForZSet().score(QUEUE, winner) : 1200;
        double l = redis.opsForZSet().score(QUEUE, loser) != null ? redis.opsForZSet().score(QUEUE, loser) : 1200;
        double ew = 1 / (1 + Math.pow(10, (l - w) / 400));
        redis.opsForZSet().add(QUEUE, winner, w + k * (1 - ew));
        redis.opsForZSet().add(QUEUE, loser, l + k * (0 - (1 - ew)));
    }
}
