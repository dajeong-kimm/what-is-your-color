package com.ssafy.yourcolors.domain.info.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenColorDto {
    private String hex;
    private int r;
    private int g;
    private int b;
}
