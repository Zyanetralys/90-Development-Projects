package com.zyane.gt.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey key;
    private final long ttl;

    public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.ttl-ms}") long ttl) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.ttl = ttl;
    }

    public String generate(String sub, String role) {
        return Jwts.builder()
            .subject(sub)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + ttl))
            .signWith(key, Jwts.SIG.HS256)
            .compact();
    }

    public Claims validate(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
