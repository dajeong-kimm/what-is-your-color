package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.CategorizedCosmeticResponse;
import com.ssafy.yourcolors.domain.info.dto.ColorDto;
import com.ssafy.yourcolors.domain.info.dto.ColorResponse;

import java.util.List;

public interface CosmeticService {
    CategorizedCosmeticResponse getCategorizedCosmeticProductsByPersonalId(int personalId);

    ColorResponse getColorsByProductId(int productId);
}
