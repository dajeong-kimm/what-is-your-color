package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.CategorizedCosmeticResponse;
import com.ssafy.yourcolors.domain.info.dto.CosmeticProductDto;
import com.ssafy.yourcolors.domain.info.entity.ProductPersonal;
import com.ssafy.yourcolors.domain.info.repository.CosmeticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CosmeticServiceImpl implements CosmeticService {

    private final CosmeticRepository cosmeticRepository;

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
