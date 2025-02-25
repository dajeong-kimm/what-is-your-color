package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.MansProductDto;
import com.ssafy.yourcolors.domain.info.dto.MansResponseDto;
import com.ssafy.yourcolors.domain.info.dto.MenColorDto;
import com.ssafy.yourcolors.domain.info.dto.MenColorResponseDto;
import com.ssafy.yourcolors.domain.info.entity.MenProduct;
import com.ssafy.yourcolors.domain.info.entity.MenProductColor;
import com.ssafy.yourcolors.domain.info.entity.MenProductPersonal;
import com.ssafy.yourcolors.domain.info.repository.MenProductColorRepository;
import com.ssafy.yourcolors.domain.info.repository.MenProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MansServiceImpl implements MansService{
    private final MenProductRepository menProductRepository;
    private final MenProductColorRepository menProductColorRepository;

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

    @Override
    public MenColorResponseDto getProductColorByProductId(int productId) {
        // productId에 해당하는 모든 색상 정보 조회
        List<MenProductColor> colorEntities = menProductColorRepository.findByProductId(productId);
        if (colorEntities.isEmpty()) {
            throw new RuntimeException("해당 productID의 색상 정보가 없습니다.");
        }

        // 각 색상에 대해 hex 문자열을 파싱하여 r, g, b 값을 계산
        List<MenColorDto> colorDtoList = colorEntities.stream().map(entity -> {
            String hex = entity.getColor();
            int r = Integer.parseInt(hex.substring(1, 3), 16);
            int g = Integer.parseInt(hex.substring(3, 5), 16);
            int b = Integer.parseInt(hex.substring(5, 7), 16);
            return MenColorDto.builder()
                    .hex(hex)
                    .r(r)
                    .g(g)
                    .b(b)
                    .build();
        }).collect(Collectors.toList());

        return MenColorResponseDto.builder()
                .size(colorDtoList.size())
                .colors(colorDtoList)
                .build();
    }

}
