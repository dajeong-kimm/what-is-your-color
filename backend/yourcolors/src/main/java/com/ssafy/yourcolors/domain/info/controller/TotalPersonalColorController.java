package com.ssafy.yourcolors.domain.info.controller;

import com.ssafy.yourcolors.domain.info.dto.TotalPersonalColorResponseDto;
import com.ssafy.yourcolors.domain.info.service.TotalPersonalColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
@RequiredArgsConstructor
public class TotalPersonalColorController {

    private final TotalPersonalColorService totalPersonalColorService;

    @GetMapping("/tag-list")
    public ResponseEntity<TotalPersonalColorResponseDto> getTotalPersonalColors() {
        return ResponseEntity.ok(totalPersonalColorService.getAllPersonalColors());
    }
}