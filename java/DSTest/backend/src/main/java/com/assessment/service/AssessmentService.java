package com.assessment.service;

import com.assessment.model.*;
import com.assessment.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class AssessmentService {
    
    private final QuestionRepository questionRepository;
    private final ScoringService scoringService;
    private final ValidityChecker validityChecker;
    private final ProfileInterpreter profileInterpreter;
    
    public AssessmentService(QuestionRepository questionRepository,
                            ScoringService scoringService,
                            ValidityChecker validityChecker,
                            ProfileInterpreter profileInterpreter) {
        this.questionRepository = questionRepository;
        this.scoringService = scoringService;
        this.validityChecker = validityChecker;
        this.profileInterpreter = profileInterpreter;
    }
    
    /**
     * Inicia nueva evaluación
     */
    public Assessment startAssessment(String userAgent) {
        Assessment assessment = new Assessment();
        assessment.setSessionId(UUID.randomUUID().toString());
        assessment.setStartTime(Instant.now().toEpochMilli());
        assessment.setUserAgent(userAgent);
        assessment.setCompleted(false);
        assessment.setAnswers(new ArrayList<>());
        
        return assessment;
    }
    
    /**
     * Procesa respuestas y genera resultados
     */
    public Result processAssessment(List<Answer> answers, String userAgent) {
        // 1. Verificar validez
        ValidityScales validity = validityChecker.evaluateValidity(answers);
        
        // 2. Calcular scores por dimensión
        Map<String, ScoringService.DimensionScore> dimensionScores = 
            scoringService.calculateDimensionScores(answers);
        
        // 3. Identificar roles principales
        List<Role> topRoles = scoringService.identifyTopRoles(dimensionScores, 5);
        
        // 4. Determinar rol primario y secundario
        String primaryRole = topRoles.size() > 0 ? topRoles.get(0).getName() : "No determinado";
        String secondaryRole = topRoles.size() > 1 ? topRoles.get(1).getName() : "No determinado";
        
        // 5. Determinar categoría principal
        String category = topRoles.size() > 0 ? topRoles.get(0).getCategory() : "No determinado";
        
        // 6. Generar interpretación
        String interpretation = profileInterpreter.generateInterpretation(topRoles, dimensionScores, validity);
        
        // 7. Calcular confianza
        double confidence = calculateConfidence(validity, answers.size());
        
        // 8. Crear resultado
        Result result = new Result();
        result.setTopRoles(topRoles);
        result.setPrimaryRole(primaryRole);
        result.setSecondaryRole(secondaryRole);
        result.setCategory(category);
        result.setCategoryScores(convertToCategoryScores(dimensionScores));
        result.setInterpretation(interpretation);
        result.setConfidence(confidence);
        result.setAssessmentDate(Instant.now().toEpochMilli());
        
        return result;
    }
    
    private List<Result.CategoryScore> convertToCategoryScores(
            Map<String, ScoringService.DimensionScore> scores) {
        
        List<Result.CategoryScore> categoryScores = new ArrayList<>();
        
        Map<String, String> categoryNames = new HashMap<>();
        categoryNames.put("power", "Power Exchange");
        categoryNames.put("sensation", "Sensation Seeking");
        categoryNames.put("primal", "Primal Instinct");
        categoryNames.put("nurturing", "Nurturing Dynamic");
        categoryNames.put("pet", "Pet Play");
        categoryNames.put("ownership", "Ownership");
        categoryNames.put("bondage", "Bondage");
        categoryNames.put("observation", "Observation");
        categoryNames.put("service", "Service");
        categoryNames.put("switch", "Switch");
        
        for (Map.Entry<String, ScoringService.DimensionScore> entry : scores.entrySet()) {
            String cat = entry.getKey();
            ScoringService.DimensionScore ds = entry.getValue();
            
            categoryScores.add(new Result.CategoryScore(
                cat,
                categoryNames.getOrDefault(cat, cat),
                ds.getRawScore(),
                ds.getPercentile()
            ));
        }
        
        return categoryScores;
    }
    
    private double calculateConfidence(ValidityScales validity, int answerCount) {
        double baseConfidence = 0.95;
        
        // Reducir confianza si validez es cuestionable
        if (validity.getLevel() == ValidityScales.ValidityLevel.QUESTIONABLE) {
            baseConfidence *= 0.7;
        } else if (validity.getLevel() == ValidityScales.ValidityLevel.INVALID) {
            baseConfidence *= 0.3;
        }
        
        // Reducir confianza si hay muchas respuestas faltantes
        int expectedQuestions = questionRepository.getAllQuestions().size();
        double completionRate = (double) answerCount / expectedQuestions;
        
        if (completionRate < 0.8) {
            baseConfidence *= (completionRate / 0.8);
        }
        
        return Math.round(baseConfidence * 100.0) / 100.0;
    }
    
    /**
     * Obtiene todas las preguntas para el frontend
     */
    public List<Question> getAllQuestions() {
        return questionRepository.getAllQuestions();
    }
    
    /**
     * Obtiene metadata de la evaluación
     */
    public Map<String, Object> getAssessmentMetadata() {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("totalQuestions", questionRepository.getAllQuestions().size());
        metadata.put("clinicalQuestions", questionRepository.getClinicalQuestions().size());
        metadata.put("validityQuestions", questionRepository.getValidityQuestions().size());
        metadata.put("estimatedTimeMinutes", 30);
        metadata.put("scaleMin", 1);
        metadata.put("scaleMax", 5);
        metadata.put("scaleLabels", Map.of(
            1, "Totalmente en desacuerdo",
            2, "En desacuerdo",
            3, "Neutral",
            4, "De acuerdo",
            5, "Totalmente de acuerdo"
        ));
        
        return metadata;
    }
}
