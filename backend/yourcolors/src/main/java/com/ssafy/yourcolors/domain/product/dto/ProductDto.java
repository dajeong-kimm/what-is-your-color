package com.ssafy.yourcolors.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor //파라미터가 없는 기본 생성자 자동 생성
@AllArgsConstructor //모든 필드 매개변수로 받는 생성자 자동 생성
public class ProductDto {
    private int productId;
    private String productName;
    private String category;
    private String brand;
    private String colorName;
    private int price;
}
