package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.CategorizedCosmeticResponse;

public interface CosmeticService {
    CategorizedCosmeticResponse getCategorizedCosmeticProductsByPersonalId(int personalId);
}
