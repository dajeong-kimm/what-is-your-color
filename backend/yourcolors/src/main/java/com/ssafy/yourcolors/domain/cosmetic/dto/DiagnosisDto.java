package com.ssafy.yourcolors.domain.cosmetic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiagnosisDto {
    private int rank;
    private String personalColor;
    private String probability;
}
