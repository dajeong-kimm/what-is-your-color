package com.ssafy.yourcolors.domain.cosmetic.dto;

import lombok.Data;
import java.util.List;

@Data
public class LipResponseDto {
    private String lipColor;
    private List<DiagnosisDto> diagnosis;
}
