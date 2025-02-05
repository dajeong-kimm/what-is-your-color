package com.ssafy.yourcolors.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CosmeticProductDto {
    private int productId;
    private String productName;
    private String category;
    private String brand;
    private String colorName;
    private int price;
    private String image;
}
