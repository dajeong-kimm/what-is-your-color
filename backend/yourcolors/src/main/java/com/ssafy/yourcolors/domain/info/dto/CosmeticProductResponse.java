package com.ssafy.yourcolors.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CosmeticProductResponse {
    private int totalCnt;
    private List<CosmeticProductDto> products;
}
