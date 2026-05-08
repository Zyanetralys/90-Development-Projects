package com.assessment.service;

import com.assessment.model.*;
import com.assessment.repository.QuestionRepository;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScoringService {
    
    private final QuestionRepository questionRepository;
    private final NormativeDataService normativeDataService;
    
    public ScoringService(QuestionRepository questionRepository, 
                         NormativeDataService normativeDataService) {
        this.questionRepository = questionRepository;
        this.normativeDataService = normativeDataService;
    }
    
    /**
     * Calcula T-scores para todas las dimensiones
     * Fórmula: T = 50 + 10 * ((raw - mean) / SD)
     */
    public Map<String, DimensionScore> calculateDimensionScores(List<Answer> answers) {
        Map<String, DimensionScore> scores = new HashMap<>();
        List<Question> questions = questionRepository.getAllQuestions();
        
        // Agrupar respuestas por dimensión
        Map<String, List<Integer>> dimensionResponses = new HashMap<>();
        
        for (Answer answer : answers) {
            Question q = questions.stream()
                .filter(qq -> qq.getId() == answer.getQuestionId())
                .findFirst()
                .orElse(null);
            
            if (q != null && !"validity".equals(q.getCategory())) {
                String dim = q.getCategory();
                dimensionResponses.computeIfAbsent(dim, k -> new ArrayList<>()).add(
                    q.getType() == QuestionType.LIKERT_NEGATIVE 
                        ? (6 - answer.getValue())  // Reverse score
                        : answer.getValue()
                );
            }
        }
        
        // Calcular T-scores por dimensión
        for (Map.Entry<String, List<Integer>> entry : dimensionResponses.entrySet()) {
            String dimension = entry.getKey();
            List<Integer> responses = entry.getValue();
            
            int rawScore = responses.stream().mapToInt(Integer::intValue).sum();
            NormativeData norm = normativeDataService.getNormativeData(dimension);
            
            double tScore = calculateTScore(rawScore, norm.getMean(), norm.getSd());
            double percentile = calculatePercentile(tScore);
            
            scores.put(dimension, new DimensionScore(
                dimension,
                rawScore,
                Math.round(tScore * 10.0) / 10.0,
                Math.round(percentile * 10.0) / 10.0,
                interpretTScore(tScore)
            ));
        }
        
        return scores;
    }
    
    /**
     * Calcula T-score a partir de raw score
     */
    private double calculateTScore(int raw, double mean, double sd) {
        return 50 + 10 * ((raw - mean) / sd);
    }
    
    /**
     * Convierte T-score a percentil
     */
    private double calculatePercentile(double tScore) {
        // Distribución normal acumulada simplificada
        double z = (tScore - 50) / 10;
        return 0.5 * (1 + erf(z / Math.sqrt(2)));
    }
    
    private double erf(double x) {
        // Aproximación de la función de error
        double sign = Math.signum(x);
        x = Math.abs(x);
        double t = 1.0 / (1.0 + 0.3275911 * x);
        double erf = 1.0 - (((((1.061403714 * t - 1.453152027) * t) + 1.421413741) * t 
                  - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
        return sign * erf;
    }
    
    /**
     * Interpreta T-score clínicamente
     */
    private String interpretTScore(double t) {
        if (t < 40) return "Muy Bajo";
        if (t < 45) return "Bajo";
        if (t < 55) return "Promedio";
        if (t < 60) return "Alto";
        if (t < 65) return "Muy Alto";
        return "Clínicamente Significativo";
    }
    
    /**
     * Identifica los roles principales basados en el perfil
     */
    public List<Role> identifyTopRoles(Map<String, DimensionScore> scores, int topN) {
        List<Role> allRoles = new ArrayList<>(Arrays.asList(Role.getMainRoles()));
        
        // Asignar scores a roles basados en dimensiones
        for (Role role : allRoles) {
            int score = calculateRoleScore(role, scores);
            role.setScore(score);
        }
        
        // Ordenar por score descendente
        allRoles.sort((a, b) -> Integer.compare(b.getScore(), a.getScore()));
        
        // Calcular porcentajes
        int maxScore = allRoles.get(0).getScore();
        for (Role role : allRoles) {
            role.setPercentage(maxScore > 0 ? (role.getScore() * 100.0 / maxScore) : 0);
        }
        
        return allRoles.subList(0, Math.min(topN, allRoles.size()));
    }
    
    private int calculateRoleScore(Role role, Map<String, DimensionScore> scores) {
        int score = 0;
        
        // Mapeo de dimensiones a roles
        switch (role.getId()) {
            case "dominant":
            case "domme":
            case "owner":
                score = getScoreForDimension(scores, "power", 65);
                break;
            case "submissive":
            case "slave":
            case "service_sub":
                score = getScoreForDimension(scores, "power", 35);
                break;
            case "switch":
                score = getScoreForDimension(scores, "power", 50);
                break;
            case "masochist":
                score = getScoreForDimension(scores, "sensation", 65);
                break;
            case "sadist":
                score = getScoreForDimension(scores, "sensation", 65);
                break;
            case "primal_predator":
                score = getScoreForDimension(scores, "primal", 65);
                break;
            case "primal_prey":
                score = getScoreForDimension(scores, "primal", 65);
                break;
            case "caregiver":
                score = getScoreForDimension(scores, "nurturing", 65);
                break;
            case "little":
                score = getScoreForDimension(scores, "nurturing", 35);
                break;
            case "pet":
                score = getScoreForDimension(scores, "pet", 60);
                break;
            case "hedonist":
                score = getScoreForDimension(scores, "sensation", 60);
                break;
            case "rigger":
            case "rope_bunny":
                score = getScoreForDimension(scores, "bondage", 60);
                break;
            case "voyeur":
            case "exhibitionist":
                score = getScoreForDimension(scores, "observation", 60);
                break;
            default:
                score = 50;
        }
        
        return score;
    }
    
    private int getScoreForDimension(Map<String, DimensionScore> scores, String dim, double target) {
        DimensionScore ds = scores.get(dim);
        if (ds == null) return 50;
        
        double distance = Math.abs(ds.getTScore() - target);
        return (int) Math.max(0, 100 - (distance * 2));
    }
    
    /**
     * Clase interna para scores de dimensión
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class DimensionScore {
        private String dimension;
        private int rawScore;
        private double tScore;
        private double percentile;
        private String interpretation;
    }
}
