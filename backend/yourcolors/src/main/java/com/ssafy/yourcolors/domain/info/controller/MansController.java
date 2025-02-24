package com.ssafy.yourcolors.domain.info.controller;


import com.ssafy.yourcolors.domain.info.dto.MansResponseDto;
import com.ssafy.yourcolors.domain.info.service.MansService;
import lombok.RequiredArgsConstructor;
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

}