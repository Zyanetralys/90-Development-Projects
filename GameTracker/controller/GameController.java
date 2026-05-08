package com.zyane.gt.controller;
import com.zyane.gt.dto.PageResponse; import com.zyane.gt.dto.GameDto; import com.zyane.gt.service.GameService; import lombok.RequiredArgsConstructor; import org.springframework.data.domain.PageRequest; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/games") @RequiredArgsConstructor
public class GameController {
    private final GameService svc;
    @GetMapping public ResponseEntity<PageResponse<GameDto>> search(@RequestParam(defaultValue="") String q, @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(PageResponse.from(svc.search(q, PageRequest.of(page, size))));
    }
}
