package com.ssafy.yourcolors.domain.cosmetic.dto;

import lombok.Data;
import java.util.List;

@Data
public class CombinedResponseDto {
    private List<DiagnosisDto> faceRanking;
    private List<DiagnosisDto> lipRanking;
    private String lipColor;
    private String matchingProbability;
}
