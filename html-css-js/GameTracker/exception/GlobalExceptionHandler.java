package com.zyane.gt.exception;
import org.springframework.http.*; import org.springframework.web.bind.*; import java.util.stream.Collectors;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream().map(f->f.getField()+": "+f.getDefaultMessage()).collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ErrorResponse(400, msg));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> fallback(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal server error"));
    }
}
record ErrorResponse(int status, String message) {}
