package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.MansResponseDto;
import com.ssafy.yourcolors.domain.info.dto.MenColorResponseDto;

public interface MansService {
    MansResponseDto getMansProducts(int personalId);
    MenColorResponseDto getProductColorByProductId(int productId);

}
