package com.ssafy.yourcolors.domain.info.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenColorResponseDto {
    private MenColorDto colors;
}
