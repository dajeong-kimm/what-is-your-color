package com.ssafy.yourcolors.domain.result.controller;

import com.ssafy.yourcolors.domain.result.dto.EmailRequestDto;
import com.ssafy.yourcolors.domain.result.dto.QrRequestDto;
import com.ssafy.yourcolors.domain.result.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/result")
@RequiredArgsConstructor
public class ResultController {
    private final ResultService resultService;

    @PostMapping(value = "/mail", consumes = "multipart/form-data")
    public String sendEmail(
            @RequestParam("email") String email,
            @RequestParam("image") MultipartFile image,
            @RequestParam("bestColor") String bestColor,
            @RequestParam("subColor1") String subColor1,
            @RequestParam("subColor2") String subColor2,
            @RequestParam("message") String message
    ) throws IOException {
        return resultService.sendEmail(email, image, bestColor, subColor1, subColor2, message);
    }

    @PostMapping("/qr")
    public ResponseEntity<?> generateQr(
            @RequestParam("image") MultipartFile image,  // ✅ MultipartFile로 이미지 받기
            @RequestParam("bestColor") String bestColor,
            @RequestParam("subColor1") String subColor1,
            @RequestParam("subColor2") String subColor2,
            @RequestParam("message") String message
    ) {
        String qrUrl = resultService.generateQrCode(image, bestColor, subColor1, subColor2, message);
        return ResponseEntity.ok(Map.of("qrUrl", qrUrl));
    }

}
