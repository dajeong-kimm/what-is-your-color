package com.ssafy.yourcolors.domain.info.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MenColorResponseDto {
    private int size;
    private List<MenColorDto> colors;
}
