package com.assessment.model;

public enum QuestionType {
    // Standard Likert items (1-5)
    LIKERT_POSITIVE,    // Higher = more of trait
    LIKERT_NEGATIVE,    // Higher = less of trait (reverse scored)
    
    // Forced choice for difficult distinctions
    FORCED_CHOICE_A,    // Option A selected
    FORCED_CHOICE_B,    // Option B selected
    
    // Validity scale items
    VALIDITY_LIE,       // Social desirability check
    VALIDITY_INFREQUENT,// Rare response check
    VALIDITY_INCONSISTENT,// Paired inconsistency check
    
    // Demographic/Contextual (not scored)
    DEMOGRAPHIC,
    CONTEXTUAL,
    
    // Open-ended qualitative
    OPEN_ENDED
}
