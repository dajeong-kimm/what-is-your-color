package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.CategorizedCosmeticResponse;
import com.ssafy.yourcolors.domain.info.dto.ColorDto;
import com.ssafy.yourcolors.domain.info.dto.ColorResponse;
import com.ssafy.yourcolors.domain.info.dto.CosmeticProductDto;
import com.ssafy.yourcolors.domain.info.entity.ProductColor;
import com.ssafy.yourcolors.domain.info.entity.ProductPersonal;
import com.ssafy.yourcolors.domain.info.repository.CosmeticRepository;
import com.ssafy.yourcolors.domain.info.repository.ProductColorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CosmeticServiceImpl implements CosmeticService {

    private final CosmeticRepository cosmeticRepository;
    private final ProductColorRepository productColorRepository;

    @Override
    public CategorizedCosmeticResponse getCategorizedCosmeticProductsByPersonalId(int personalId) {
        List<ProductPersonal> productPersonals = cosmeticRepository.findByIdPersonalId(personalId);

        // 카테고리별로 분류
        List<CosmeticProductDto> lipProducts = productPersonals.stream()
                .filter(pp -> "립".equals(pp.getProduct().getCategory()))
                .map(this::convertToDto)
                .collect(Collectors.toList());

        List<CosmeticProductDto> eyeProducts = productPersonals.stream()
                .filter(pp -> "아이".equals(pp.getProduct().getCategory()))
                .map(this::convertToDto)
                .collect(Collectors.toList());

        List<CosmeticProductDto> cheekProducts = productPersonals.stream()
                .filter(pp -> "치크".equals(pp.getProduct().getCategory()))
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new CategorizedCosmeticResponse(
                lipProducts.size(),
                eyeProducts.size(),
                cheekProducts.size(),
                lipProducts,
                eyeProducts,
                cheekProducts
        );
    }

    @Override
    public ColorResponse getColorsByProductId(int productId) {
        List<ProductColor> colors = productColorRepository.findByProduct_ProductId(productId);

        List<ColorDto> colorDtos = colors.stream()
                .map(color -> {
                    int[] rgb = hexToRgb(color.getColor());
                    return new ColorDto(color.getColor(), rgb[0], rgb[1], rgb[2]); // size는 나중에 설정
                })
                .collect(Collectors.toList());

        return new ColorResponse(colorDtos.size(), colorDtos); // size와 colors 리스트 반환
    }

    // HEX → RGB 변환 메서드
    private int[] hexToRgb(String hex) {
        hex = hex.replace("#", "");
        int r = Integer.parseInt(hex.substring(0, 2), 16);
        int g = Integer.parseInt(hex.substring(2, 4), 16);
        int b = Integer.parseInt(hex.substring(4, 6), 16);
        return new int[]{r, g, b};
    }

    private CosmeticProductDto convertToDto(ProductPersonal pp) {
        return new CosmeticProductDto(
                pp.getProduct().getProductId(),
                pp.getProduct().getProductName(),
                pp.getProduct().getCategory(),
                pp.getProduct().getBrand(),
                pp.getProduct().getProductDetailName(),
                pp.getProduct().getPrice(),
                pp.getProduct().getImage()
        );
    }
}
