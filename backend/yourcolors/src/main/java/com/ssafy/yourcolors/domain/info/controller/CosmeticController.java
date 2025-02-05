package com.ssafy.yourcolors.domain.info.controller;

import com.ssafy.yourcolors.domain.info.dto.CategorizedCosmeticResponse;
import com.ssafy.yourcolors.domain.info.dto.ColorDto;
import com.ssafy.yourcolors.domain.info.dto.ColorResponse;
import com.ssafy.yourcolors.domain.info.service.CosmeticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/info/cosmetic")
@RequiredArgsConstructor
public class CosmeticController {

    private final CosmeticService cosmeticService;

    @GetMapping("/{personal-id}")
    public ResponseEntity<CategorizedCosmeticResponse> getCategorizedCosmeticsByPersonalId(@PathVariable("personal-id") int personalId) {
        return ResponseEntity.ok(cosmeticService.getCategorizedCosmeticProductsByPersonalId(personalId));
    }

    @GetMapping("/product/{product-id}")
    public ResponseEntity<ColorResponse> getColorsByProductId(@PathVariable("product-id") int productId) {
        ColorResponse colorResponse = cosmeticService.getColorsByProductId(productId);
        return ResponseEntity.ok(colorResponse);
    }
}
