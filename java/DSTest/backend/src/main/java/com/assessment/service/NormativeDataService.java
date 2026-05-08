package com.assessment.service;

import com.assessment.model.NormativeData;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class NormativeDataService {
    
    private final Map<String, NormativeData> normativeDataMap;
    
    public NormativeDataService() {
        this.normativeDataMap = Arrays.stream(NormativeData.getDefaults())
            .collect(Collectors.toMap(NormativeData::getDimension, Function.identity()));
    }
    
    public NormativeData getNormativeData(String dimension) {
        return normativeDataMap.getOrDefault(dimension, 
            new NormativeData(dimension, 50.0, 10.0, 2500, "Default population"));
    }
    
    public Map<String, NormativeData> getAllNormativeData() {
        return normativeDataMap;
    }
}
