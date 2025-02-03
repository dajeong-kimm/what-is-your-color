package com.ssafy.yourcolors.domain.personal.controller;

import com.ssafy.yourcolors.domain.personal.Entity.PersonalColor;
import com.ssafy.yourcolors.domain.personal.dto.PersonalDto;
import com.ssafy.yourcolors.domain.personal.service.PersonalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis/personal-color")
public class PersonalController {
    @Autowired
    private PersonalService personalService;

    @GetMapping("/{personalId}")
    public PersonalDto getPersonalDetails(@PathVariable Long personalId) {
        PersonalColor personal = personalService.getPersonalById(personalId);
        return new PersonalDto(personal);
    }
}