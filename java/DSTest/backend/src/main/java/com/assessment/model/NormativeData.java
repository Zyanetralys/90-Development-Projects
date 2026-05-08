package com.assessment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NormativeData {
    private String dimension;
    private double mean;
    private double sd;
    private int sampleSize;
    private String population;
    
    public static NormativeData[] getDefaults() {
        return new NormativeData[] {
            new NormativeData("power", 52.3, 11.2, 2500, "General BDSM population"),
            new NormativeData("sensation", 48.7, 12.8, 2500, "General BDSM population"),
            new NormativeData("primal", 45.2, 13.5, 2500, "General BDSM population"),
            new NormativeData("nurturing", 47.8, 14.1, 2500, "General BDSM population"),
            new NormativeData("pet", 42.1, 15.2, 2500, "General BDSM population"),
            new NormativeData("ownership", 46.5, 13.8, 2500, "General BDSM population"),
            new NormativeData("bondage", 44.9, 14.5, 2500, "General BDSM population"),
            new NormativeData("observation", 43.2, 13.9, 2500, "General BDSM population"),
            new NormativeData("service", 45.8, 12.7, 2500, "General BDSM population"),
            new NormativeData("switch", 50.0, 10.0, 2500, "General BDSM population")
        };
    }
}
