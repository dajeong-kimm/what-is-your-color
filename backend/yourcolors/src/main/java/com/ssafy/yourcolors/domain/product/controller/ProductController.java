package com.ssafy.yourcolors.domain.product.controller;

import com.ssafy.yourcolors.domain.product.dto.ProductDto;
import com.ssafy.yourcolors.domain.product.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 퍼스널 컬러 기반 추천 API
    @GetMapping("/recommendations/{personalId}")
    public List<ProductDto> getRecommendedProducts(@PathVariable int personalId) {
        return productService.getRecommendedProducts(personalId);
    }

    // 제품 상세 정보 조회 API
    @GetMapping("/color-palette/{productId}")
    public ProductDto getProductDetails(@PathVariable int productId) {
        return productService.getProductDetails(productId);
    }
}
