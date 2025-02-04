package com.ssafy.yourcolors.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class CategorizedCosmeticResponse {
    private int lipCount;
    private int eyeCount;
    private int cheekCount;
    private List<CosmeticProductDto> lipProducts;
    private List<CosmeticProductDto> eyeProducts;
    private List<CosmeticProductDto> cheekProducts;
}
