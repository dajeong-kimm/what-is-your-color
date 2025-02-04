package com.ssafy.yourcolors.domain.product.service;

import com.ssafy.yourcolors.domain.product.dto.ProductDto;
import com.ssafy.yourcolors.domain.product.entity.Product;
import com.ssafy.yourcolors.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 퍼스널 컬러 기반 화장품 추천
    public List<ProductDto> getRecommendedProducts(int personalId) {
        return productRepository.findProductsByPersonalColor(personalId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 제품 상세 정보 조회
    public ProductDto getProductDetails(int productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDto(product);
    }

    // Entity → DTO 변환
    private ProductDto convertToDto(Product product) {
        return ProductDto.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .brand(product.getBrand())
                .category(product.getCategory())
                .price(product.getPrice())
                .colorName(product.getColorName())
//                .image(product.getImage())
                .build();
    }
}
