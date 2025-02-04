package com.ssafy.yourcolors.domain.personal.service;

import com.ssafy.yourcolors.domain.personal.dto.PersonalColorResponseDto;
import com.ssafy.yourcolors.domain.personal.entity.PersonalColor;

public interface PersonalService {
    PersonalColorResponseDto analyzePersonalColor(String imageUrl);
    PersonalColor getPersonalById(Long personalId);
}