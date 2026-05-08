package com.assessment.service;

import com.assessment.model.*;
import com.assessment.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ValidityChecker {
    
    private final QuestionRepository questionRepository;
    
    public ValidityChecker(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }
    
    /**
     * Evalúa todas las escalas de validez
     */
    public ValidityScales evaluateValidity(List<Answer> answers) {
        List<Question> validityQuestions = questionRepository.getValidityQuestions();
        
        // Calcular raw scores por escala
        int lRaw = calculateScaleScore(answers, validityQuestions, QuestionType.VALIDITY_LIE);
        int fRaw = calculateScaleScore(answers, validityQuestions, QuestionType.VALIDITY_INFREQUENT);
        int kRaw = calculateKScale(answers, validityQuestions);
        int vrinRaw = calculateVRIN(answers, validityQuestions);
        int trinRaw = calculateTRIN(answers, validityQuestions);
        
        return ValidityScales.evaluate(lRaw, fRaw, kRaw, vrinRaw, trinRaw);
    }
    
    private int calculateScaleScore(List<Answer> answers, List<Question> questions, 
                                    QuestionType type) {
        return questions.stream()
            .filter(q -> q.getType() == type)
            .mapToInt(q -> {
                Answer a = answers.stream()
                    .filter(ans -> ans.getQuestionId() == q.getId())
                    .findFirst()
                    .orElse(null);
                return a != null ? a.getValue() : 3; // Default al centro si falta
            })
            .filter(v -> v >= 4) // Contar respuestas "elevadas"
            .sum();
    }
    
    private int calculateKScale(List<Answer> answers, List<Question> questions) {
        // K scale mide defensividad (ítems 1-8 invertidos)
        return questions.stream()
            .filter(q -> q.getType() == QuestionType.VALIDITY_LIE)
            .mapToInt(q -> {
                Answer a = answers.stream()
                    .filter(ans -> ans.getQuestionId() == q.getId())
                    .findFirst()
                    .orElse(null);
                return a != null ? (6 - a.getValue()) : 3;
            })
            .sum();
    }
    
    private int calculateVRIN(List<Answer> answers, List<Question> questions) {
        // VRIN mide inconsistencia entre pares de ítems similares
        int inconsistencies = 0;
        
        // Par 15-16 (deberían ser opuestos)
        inconsistencies += checkPairConsistency(answers, 15, 16, true);
        // Par 17-18 (deberían ser opuestos)
        inconsistencies += checkPairConsistency(answers, 17, 18, true);
        // Par 19-20 (pueden ser similares)
        inconsistencies += checkPairConsistency(answers, 19, 20, false);
        
        return inconsistencies;
    }
    
    private int calculateTRIN(List<Answer> answers, List<Question> questions) {
        // TRIN mide tendencia a responder siempre igual (acquiescence)
        int yesCount = 0;
        int noCount = 0;
        
        for (Answer a : answers) {
            if (a.getValue() >= 4) yesCount++;
            if (a.getValue() <= 2) noCount++;
        }
        
        return Math.abs(yesCount - noCount);
    }
    
    private int checkPairConsistency(List<Answer> answers, int q1, int q2, boolean shouldBeOpposite) {
        Answer a1 = answers.stream().filter(a -> a.getQuestionId() == q1).findFirst().orElse(null);
        Answer a2 = answers.stream().filter(a -> a.getQuestionId() == q2).findFirst().orElse(null);
        
        if (a1 == null || a2 == null) return 0;
        
        int diff = Math.abs(a1.getValue() - a2.getValue());
        
        if (shouldBeOpposite) {
            // Deberían ser opuestos (diff alto = consistente)
            return diff >= 3 ? 0 : 1;
        } else {
            // Deberían ser similares (diff bajo = consistente)
            return diff <= 2 ? 0 : 1;
        }
    }
}
