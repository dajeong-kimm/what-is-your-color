package com.ssafy.yourcolors.domain.consult.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistResponse {

    private List<Result> results;
    private String gptSummary;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Result {
        private int rank;
        private String personalColor;
        private int personalId;
    }

}
