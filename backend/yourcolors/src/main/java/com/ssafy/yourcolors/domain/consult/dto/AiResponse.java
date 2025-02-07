package com.ssafy.yourcolors.domain.consult.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiResponse {
    private List<Result> results;
    private String gptSummary;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Result {
        private double probability;  // 확률을 double로 변경 (ex: 84.46%)
        private String personalColor;
    }
}
