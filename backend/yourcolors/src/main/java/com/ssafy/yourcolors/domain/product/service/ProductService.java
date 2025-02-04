package com.ssafy.yourcolors.domain.product.service;

import com.ssafy.yourcolors.domain.product.dto.ProductDto;

import java.util.List;

public interface ProductService {

    // 퍼스널 컬러 기반 화장품 추천
    List<ProductDto> getRecommendedProducts(int personalId);

    // 제품 상세 정보 조회
    ProductDto getProductDetails(int productId);

}
