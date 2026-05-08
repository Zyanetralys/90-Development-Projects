package com.zyane.gt.domain;
import jakarta.persistence.*; import java.time.Instant; import java.util.Set;
@Entity @Table(name = "games", indexes = @Index(columnList = "title", unique = true))
public class Game {
    @Id private String igdbId;
    @Column(nullable=false, length=150) private String title;
    private String coverUrl;
    @ElementCollection @CollectionTable(name="game_roles", joinColumns=@JoinColumn(name="game_id"))
    @Column(name="role") private Set<String> roles;
    private Double avgRating;
    private Instant updatedAt;
    @PreUpdate void touch() { updatedAt = Instant.now(); }
    // getters/setters
}
