package com.assessment.service;

import com.assessment.model.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProfileInterpreter {
    
    /**
     * Genera interpretación clínica completa del perfil
     */
    public String generateInterpretation(List<Role> topRoles, 
                                         Map<String, ScoringService.DimensionScore> dimensionScores,
                                         ValidityScales validity) {
        
        StringBuilder interpretation = new StringBuilder();
        
        // 1. Validez del protocolo
        interpretation.append("═══ VALIDEZ DEL PROTOCOLO ═══\n");
        interpretation.append(validity.getValidityMessage()).append("\n\n");
        
        if (!validity.isValid()) {
            interpretation.append("⚠️ ADVERTENCIA: Este protocolo tiene problemas de validez. ");
            interpretation.append("Los resultados pueden no ser precisos. Se recomienda repetir la evaluación.\n\n");
            return interpretation.toString();
        }
        
        // 2. Rol primario y secundario
        interpretation.append("═══ PERFIL PRINCIPAL ═══\n");
        if (topRoles.size() >= 1) {
            Role primary = topRoles.get(0);
            interpretation.append("Rol Primario: ").append(primary.getName())
                .append(" (").append(Math.round(primary.getPercentage())).append("%)\n");
            interpretation.append(primary.getDescription()).append("\n\n");
        }
        
        if (topRoles.size() >= 2) {
            Role secondary = topRoles.get(1);
            interpretation.append("Rol Secundario: ").append(secondary.getName())
                .append(" (").append(Math.round(secondary.getPercentage())).append("%)\n");
            interpretation.append(secondary.getDescription()).append("\n\n");
        }
        
        // 3. Patrón de código (2-3 picos principales)
        interpretation.append("═══ PATRÓN DE CÓDIGO ═══\n");
        interpretation.append(generateCodePattern(topRoles)).append("\n\n");
        
        // 4. Interpretación por dimensiones
        interpretation.append("═══ DIMENSIONES CLÍNICAS ═══\n");
        for (ScoringService.DimensionScore ds : dimensionScores.values()) {
            interpretation.append(ds.getDimension()).append(": ")
                .append(ds.getTScore()).append("T (")
                .append(ds.getInterpretation()).append(")\n");
            interpretation.append(getDimensionInterpretation(ds.getDimension(), ds.getTScore()))
                .append("\n");
        }
        
        // 5. Recomendaciones
        interpretation.append("\n═══ RECOMENDACIONES ═══\n");
        interpretation.append(generateRecommendations(topRoles, dimensionScores));
        
        // 6. Disclaimer ético
        interpretation.append("\n═══ DISCLAIMER ═══\n");
        interpretation.append("Esta evaluación es una herramienta de autoconocimiento, NO un diagnóstico clínico. ");
        interpretation.append("Los resultados deben interpretarse con cuidado y no sustituyen evaluación psicológica profesional. ");
        interpretation.append("Todas las prácticas BDSM deben ser SSC (Safe, Sane, Consensual) o RACK (Risk-Aware Consensual Kink).");
        
        return interpretation.toString();
    }
    
    private String generateCodePattern(List<Role> roles) {
        if (roles.size() < 2) return "Perfil unidimensional";
        
        String primary = roles.get(0).getCategory();
        String secondary = roles.get(1).getCategory();
        
        return String.format("Código %s-%s: Combinación de %s con %s. ",
            primary.substring(0, 3).toUpperCase(),
            secondary.substring(0, 3).toUpperCase(),
            roles.get(0).getName(),
            roles.get(1).getName());
    }
    
    private String getDimensionInterpretation(String dimension, double tScore) {
        Map<String, String> interpretations = new HashMap<>();
        
        interpretations.put("power", tScore > 60 
            ? "→ Fuerte necesidad de estructura de poder definida. Busca claridad en roles."
            : tScore < 40 
            ? "→ Preferencia por dinámicas igualitarias o fluidas."
            : "→ Flexibilidad moderada en dinámicas de poder.");
        
        interpretations.put("sensation", tScore > 60 
            ? "→ Alta tolerancia/búsqueda de intensidad física. El dolor/placer extremo es relevante."
            : tScore < 40 
            ? "→ Preferencia por sensaciones suaves, evitar dolor intenso."
            : "→ Rango moderado de búsqueda de sensaciones.");
        
        interpretations.put("primal", tScore > 60 
            ? "→ Instintos animales fuertes. Sexo instintivo, no verbal, es importante."
            : tScore < 40 
            ? "→ Preferencia por sexo racional, negociado, verbal."
            : "→ Balance entre instinto y racionalidad.");
        
        interpretations.put("nurturing", tScore > 60 
            ? "→ Dinámicas de cuidado/regresión son centrales. Edad psicológica vs cronológica relevante."
            : tScore < 40 
            ? "→ Dinámicas adultas-adultas preferidas. Sin regresión."
            : "→ Flexibilidad en dinámicas de cuidado.");
        
        interpretations.put("pet", tScore > 60 
            ? "→ Identificación fuerte con rol animal. Collares, comportamientos de mascota relevantes."
            : tScore < 40 
            ? "→ Sin identificación con rol animal."
            : "→ Interés moderado en pet play.");
        
        interpretations.put("bondage", tScore > 60 
            ? "→ Ataduras/inmovilización son esenciales. Cuerdas, restricción importantes."
            : tScore < 40 
            ? "→ Preferencia por libertad de movimiento, evitar restricción."
            : "→ Uso moderado de bondage.");
        
        interpretations.put("observation", tScore > 60 
            ? "→ Voyeurismo o exhibicionismo significativos. Ver/ser visto es excitante."
            : tScore < 40 
            ? "→ Preferencia por privacidad, intimidad a puerta cerrada."
            : "→ Balance entre privacidad y exposición.");
        
        return interpretations.getOrDefault(dimension, "");
    }
    
    private String generateRecommendations(List<Role> topRoles, 
                                           Map<String, ScoringService.DimensionScore> scores) {
        StringBuilder recs = new StringBuilder();
        
        // Basado en rol primario
        if (topRoles.size() > 0) {
            String primaryId = topRoles.get(0).getId();
            
            switch (primaryId) {
                case "dominant":
                case "domme":
                case "owner":
                    recs.append("• Como dominante: Prioriza el consentimiento informado y aftercare. ");
                    recs.append("El poder conlleva responsabilidad.\n");
                    break;
                case "submissive":
                case "slave":
                    recs.append("• Como sumiso: Establece límites claros antes de escenas. ");
                    recs.append("Tu seguridad es tu responsabilidad también.\n");
                    break;
                case "switch":
                    recs.append("• Como switch: Comunica tu rol actual claramente a cada pareja. ");
                    recs.append("La negociación es clave.\n");
                    break;
                case "masochist":
                    recs.append("• Como masoquista: Conoce tus límites físicos. ");
                    recs.append("Aftercare físico y emocional es esencial.\n");
                    break;
                case "little":
                    recs.append("• Como little: Busca caregivers experimentados y verificados. ");
                    recs.append("La regresión requiere espacio seguro.\n");
                    break;
            }
        }
        
        // Basado en dimensiones elevadas
        scores.forEach((dim, score) -> {
            if (score.getTScore() > 65) {
                recs.append("• ").append(dim.toUpperCase()).append(" elevado: Considera buscar ");
                recs.append("comunidad especializada para esta práctica.\n");
            }
        });
        
        recs.append("• General: Únete a comunidades BDSM locales (munches). ");
        recs.append("La educación continua es fundamental.\n");
        recs.append("• Seguridad: Aprende SSC (Safe, Sane, Consensual) y RACK.\n");
        recs.append("• Salud mental: Si hay conflicto o angustia, considera terapia kink-aware.\n");
        
        return recs.toString();
    }
}
