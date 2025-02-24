package com.ssafy.yourcolors.domain.info.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MansProductDto {
    private int productId;
    private String productName;
    private String category;
    private String brand;
    // 테이블의 product_detail_name을 color_name으로 매핑
    private String colorName;
    private int price;
    private String image;
}
