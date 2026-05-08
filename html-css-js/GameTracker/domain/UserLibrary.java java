package com.zyane.gt.domain;
import jakarta.persistence.*; import java.io.Serializable; import java.util.Objects;
@Entity @Table(name="user_library")
public class UserLibrary {
    @Embeddable
    public static class Key implements Serializable {
        @Column(name="user_id") private String userId;
        @Column(name="game_id") private String gameId;
        public Key(){} public Key(String u, String g){userId=u;gameId=g;}
        @Override public boolean equals(Object o){ if(!(o instanceof Key k))return false; return Objects.equals(userId,k.userId)&&Objects.equals(gameId,k.gameId); }
        @Override public int hashCode(){ return Objects.hash(userId,gameId); }
    }
    @EmbeddedId private Key id = new Key();
    private String status; private Integer rating; private String notes;
    // getters/setters
}
