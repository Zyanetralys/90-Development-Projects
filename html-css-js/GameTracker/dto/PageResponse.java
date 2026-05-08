package com.zyane.gt.dto;
import com.fasterxml.jackson.annotation.JsonCreator; import com.fasterxml.jackson.annotation.JsonProperty; import java.util.List;
public record PageResponse<T>(
    @JsonProperty("content") List<T> content,
    @JsonProperty("page") int page,
    @JsonProperty("size") int size,
    @JsonProperty("totalElements") long totalElements,
    @JsonProperty("totalPages") int totalPages
) {
    @JsonCreator
    public PageResponse(List<T> c, int p, int s, long te, int tp) { this.content=c; this.page=p; this.size=s; this.totalElements=te; this.totalPages=tp; }
}
