package com.ssafy.yourcolors.domain.info.controller;


import com.ssafy.yourcolors.domain.info.dto.MansResponseDto;
import com.ssafy.yourcolors.domain.info.dto.MenColorResponseDto;
import com.ssafy.yourcolors.domain.info.service.MansService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info/mans")
@RequiredArgsConstructor
public class MansController {

    private final MansService mansService;

    @GetMapping("/{personalId}")
    public MansResponseDto getMansProducts(@PathVariable("personalId") int personalId) {
        return mansService.getMansProducts(personalId);
    }

    // 제품 ID별 색상 정보(hex, r, g, b) 조회
    @GetMapping("/product/{productID}")
    public ResponseEntity<MenColorResponseDto> getProductColor(@PathVariable("productID") int productId) {
        MenColorResponseDto response = mansService.getProductColorByProductId(productId);
        return ResponseEntity.ok(response);
    }
}