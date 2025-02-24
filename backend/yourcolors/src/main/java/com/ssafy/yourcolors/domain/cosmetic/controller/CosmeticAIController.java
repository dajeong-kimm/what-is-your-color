package com.ssafy.yourcolors.domain.cosmetic.controller;

import com.ssafy.yourcolors.domain.cosmetic.dto.CombinedResponseDto;
import com.ssafy.yourcolors.domain.cosmetic.dto.LipResponseDto;
import com.ssafy.yourcolors.domain.cosmetic.service.CosmeticAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cosmetic")
public class CosmeticAIController {

    private final CosmeticAIService cosmeticService;

    @Autowired
    public CosmeticAIController(CosmeticAIService cosmeticService) {
        this.cosmeticService = cosmeticService;
    }

    @PostMapping("/lip")
    public ResponseEntity<LipResponseDto> predictLip(@RequestParam("lip_image") MultipartFile lipImage) throws Exception {
        LipResponseDto response = cosmeticService.predictLip(lipImage);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/combined")
    public ResponseEntity<CombinedResponseDto> predictCombined(
            @RequestParam("face_image") MultipartFile faceImage,
            @RequestParam("lip_image") MultipartFile lipImage) throws Exception {
        CombinedResponseDto response = cosmeticService.predictCombined(faceImage, lipImage);
        return ResponseEntity.ok(response);
    }
}
