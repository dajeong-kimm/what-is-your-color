package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.MansProductDto;
import com.ssafy.yourcolors.domain.info.dto.MansResponseDto;
import com.ssafy.yourcolors.domain.info.entity.MenProduct;
import com.ssafy.yourcolors.domain.info.entity.MenProductPersonal;
import com.ssafy.yourcolors.domain.info.repository.MenProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MansServiceImpl implements MansService{
    private final MenProductRepository menProductRepository;

    @Override
    public MansResponseDto getMansProducts(int personalId) {
        // personalId로 매핑된 MenProductPersonal 엔티티 목록 조회
        List<MenProductPersonal> mappings = menProductRepository.findByIdPersonalId(personalId);

        // MenProduct 엔티티에서 DTO 변환 (color_name은 product_detail_name으로 매핑)
        List<MansProductDto> productDtoList = mappings.stream()
                .map(mapping -> {
                    MenProduct product = mapping.getMenProduct();
                    return MansProductDto.builder()
                            .productId(product.getProductId())
                            .productName(product.getProductName())
                            .category(product.getCategory())
                            .brand(product.getBrand())
                            .colorName(product.getProductDetailName())
                            .price(product.getPrice())
                            .image(product.getImage())
                            .build();
                })
                .collect(Collectors.toList());

        MansResponseDto response = MansResponseDto.builder()
                .mansCount(productDtoList.size())
                .mansProducts(productDtoList)
                .build();

        return response;
    }

}
