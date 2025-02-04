package com.ssafy.yourcolors.domain.info.controller;

import com.ssafy.yourcolors.domain.info.dto.PersonalColorInfoResponse;
import com.ssafy.yourcolors.domain.info.service.PersonalColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
@RequiredArgsConstructor
public class PersonalColorController {

    private final PersonalColorService personalColorService;

    @GetMapping("/{personal-id}")
    public ResponseEntity<PersonalColorInfoResponse> getPersonalColor(@PathVariable("personal-id") int personalId) {
        return ResponseEntity.ok(personalColorService.getPersonalColorInfo(personalId));
    }
}
