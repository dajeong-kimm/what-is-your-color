 package com.ssafy.yourcolors.domain.info.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MansResponseDto {
    private int mansCount;
    private List<MansProductDto> mansProducts;
}
