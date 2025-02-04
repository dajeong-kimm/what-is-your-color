package com.ssafy.yourcolors.domain.info.controller;

import com.ssafy.yourcolors.domain.info.dto.CategorizedCosmeticResponse;
import com.ssafy.yourcolors.domain.info.service.CosmeticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/info/cosmetic")
@RequiredArgsConstructor
public class CosmeticController {

    private final CosmeticService cosmeticService;

    @GetMapping("/{personal-id}")
    public ResponseEntity<CategorizedCosmeticResponse> getCategorizedCosmeticsByPersonalId(@PathVariable("personal-id") int personalId) {
        return ResponseEntity.ok(cosmeticService.getCategorizedCosmeticProductsByPersonalId(personalId));
    }
}
