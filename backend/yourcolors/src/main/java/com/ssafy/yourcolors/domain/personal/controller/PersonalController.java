package com.ssafy.yourcolors.domain.personal.controller;

import com.ssafy.yourcolors.domain.personal.dto.ImageRequestDto;
import com.ssafy.yourcolors.domain.personal.dto.PersonalColorResponseDto;
import com.ssafy.yourcolors.domain.personal.entity.PersonalColor;
import com.ssafy.yourcolors.domain.personal.dto.PersonalDto;
import com.ssafy.yourcolors.domain.personal.service.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
public class PersonalController {
    @Autowired
    private PersonalService personalService;

    @PostMapping("/personal-color")
    public ResponseEntity<PersonalColorResponseDto> analyzePersonalColor(@RequestBody ImageRequestDto requestDto) {
        PersonalColorResponseDto response = personalService.analyzePersonalColor(requestDto.getImageUrl());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/personal-color/{personalId}")
    public PersonalDto getPersonalDetails(@PathVariable Long personalId) {
        PersonalColor personal = personalService.getPersonalById(personalId);
        return new PersonalDto(personal);
    }
}