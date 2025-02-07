package com.ssafy.yourcolors.domain.consult.controller;

import com.ssafy.yourcolors.domain.consult.dto.AiResponse;
import com.ssafy.yourcolors.domain.consult.dto.DistResponse;
import com.ssafy.yourcolors.domain.consult.service.ConsultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/consult")
@RequiredArgsConstructor
public class ConsultController {

    private final ConsultService consultService;

    /**
     * AI 모델을 이용한 퍼스널 컬러 진단 API
     */
    @PostMapping("/ai")
    public ResponseEntity<AiResponse> consultWithAI(@RequestParam("image") MultipartFile image) {
        AiResponse response = consultService.consultWithAI(image);
        return ResponseEntity.ok(response);
    }

    /**
     * 색상 거리 기반 퍼스널 컬러 진단 API
     */
    @PostMapping("/dist")
    public ResponseEntity<DistResponse> consultWithDist(
            @RequestParam("face_image") MultipartFile face,
            @RequestParam(value = "a4", required = false) MultipartFile a4) {
        DistResponse response = consultService.consultWithDist(face, a4);
        return ResponseEntity.ok(response);
    }
}
