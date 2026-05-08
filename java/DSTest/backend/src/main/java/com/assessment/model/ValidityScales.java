package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Validity scales modeled after MMPI-2 methodology
 * Used to detect response biases and ensure assessment quality
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValidityScales {
    
    // Raw scores
    private int lRaw;  // Lie scale: social desirability
    private int fRaw;  // Infrequency: random/extreme responding
    private int kRaw;  // Correction: defensiveness
    private int vrinRaw; // Variable Response Inconsistency
    private int trinRaw; // True Response Inconsistency
    
    // T-scores (M=50, SD=10)
    private double lT;
    private double fT;
    private double kT;
    private double vrinT;
    private double trinT;
    
    // Validity flags
    private boolean valid;
    private String validityMessage;
    private ValidityLevel level;
    
    public enum ValidityLevel {
        VALID,           // All scales within acceptable range
        QUESTIONABLE,    // One scale elevated, interpret with caution
        INVALID,         // Multiple scales elevated, do not interpret
        PROTOCOL_ERROR   // Technical error in administration
    }
    
    /**
     * Evaluate validity based on clinical cutoffs (MMPI-2 adapted)
     */
    public static ValidityScales evaluate(int lRaw, int fRaw, int kRaw, int vrinRaw, int trinRaw) {
        ValidityScales scales = new ValidityScales();
        scales.setlRaw(lRaw);
        scales.setfRaw(fRaw);
        scales.setkRaw(kRaw);
        scales.setVrinRaw(vrinRaw);
        scales.setTrinRaw(trinRaw);
        
        // Convert to T-scores using normative data (simplified)
        scales.setlT(convertToTScore(lRaw, 4.2, 2.1));   // Mean=4.2, SD=2.1
        scales.setfT(convertToTScore(fRaw, 3.8, 2.8));
        scales.setkT(convertToTScore(kRaw, 14.5, 4.2));
        scales.setVrinT(convertToTScore(vrinRaw, 8.1, 3.4));
        scales.setTrinT(convertToTScore(trinRaw, 9.2, 2.9));
        
        // Evaluate validity
        evaluateValidity(scales);
        
        return scales;
    }
    
    private static double convertToTScore(int raw, double mean, double sd) {
        // T = 50 + 10 * ((raw - mean) / sd)
        return Math.round(50 + 10 * ((raw - mean) / sd) * 10.0) / 10.0;
    }
    
    private static void evaluateValidity(ValidityScales s) {
        int flags = 0;
        StringBuilder messages = new StringBuilder();
        
        // L Scale: T > 65 suggests "faking good"
        if (s.getlT() > 65) {
            flags++;
            messages.append("• Escala L elevada: posible deseabilidad social. ");
        }
        
        // F Scale: T > 80 suggests random/extreme responding
        if (s.getfT() > 80) {
            flags += 2;
            messages.append("• Escala F muy elevada: respuestas aleatorias o extremas. ");
        } else if (s.getfT() > 65) {
            flags++;
            messages.append("• Escala F elevada: interpretar con cautela. ");
        }
        
        // K Scale: T > 65 suggests defensiveness
        if (s.getkT() > 65) {
            flags++;
            messages.append("• Escala K elevada: posible defensividad. ");
        }
        
        // VRIN: T > 65 suggests inconsistency
        if (s.getVrinT() > 65) {
            flags++;
            messages.append("• VRIN elevado: inconsistencia en respuestas. ");
        }
        
        // TRIN: Extreme scores suggest acquiescence
        if (s.getTrinT() > 70 || s.getTrinT() < 30) {
            flags++;
            messages.append("• TRIN extremo: tendencia a responder siempre igual. ");
        }
        
        // Determine overall validity
        if (flags == 0) {
            s.setLevel(ValidityLevel.VALID);
            s.setValidityMessage("Protocolo válido. Resultados interpretables.");
            s.setValid(true);
        } else if (flags == 1) {
            s.setLevel(ValidityLevel.QUESTIONABLE);
            s.setValidityMessage("Protocolo cuestionable: " + messages + "Interpretar con cautela.");
            s.setValid(true);
        } else {
            s.setLevel(ValidityLevel.INVALID);
            s.setValidityMessage("Protocolo inválido: " + messages + "No interpretar resultados.");
            s.setValid(false);
        }
    }
}
