package com.assessment.controller;

import com.assessment.model.*;
import com.assessment.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AssessmentController {
    
    private final AssessmentService assessmentService;
    
    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }
    
    /**
     * Obtiene metadata de la evaluación
     */
    @GetMapping("/metadata")
    public ResponseEntity<Map<String, Object>> getMetadata() {
        return ResponseEntity.ok(assessmentService.getAssessmentMetadata());
    }
    
    /**
     * Obtiene todas las preguntas
     */
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getQuestions() {
        return ResponseEntity.ok(assessmentService.getAllQuestions());
    }
    
    /**
     * Inicia nueva evaluación
     */
    @PostMapping("/assessment/start")
    public ResponseEntity<Assessment> startAssessment(
            @RequestHeader(value = "User-Agent", defaultValue = "Unknown") String userAgent) {
        Assessment assessment = assessmentService.startAssessment(userAgent);
        return ResponseEntity.ok(assessment);
    }
    
    /**
     * Envía respuestas y obtiene resultados
     */
    @PostMapping("/assessment/submit")
    public ResponseEntity<Result> submitAssessment(
            @RequestBody List<Answer> answers,
            @RequestHeader(value = "User-Agent", defaultValue = "Unknown") String userAgent) {
        
        // Validar que hay respuestas
        if (answers == null || answers.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validar número de respuestas
        int expectedQuestions = assessmentService.getAllQuestions().size();
        if (answers.size() < expectedQuestions * 0.8) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Insufficient answers. Minimum 80% completion required.");
            return ResponseEntity.badRequest().body(null);
        }
        
        // Procesar evaluación
        Result result = assessmentService.processAssessment(answers, userAgent);
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * Obtiene información de roles disponibles
     */
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        return ResponseEntity.ok(List.of(Role.getMainRoles()));
    }
    
    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "BDSM Role Assessment API");
        response.put("version", "2.0.0-professional");
        return ResponseEntity.ok(response);
    }
}
