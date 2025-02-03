package com.ssafy.yourcolors.domain.personal.service;

import com.ssafy.yourcolors.domain.personal.Entity.PersonalColor;

public interface PersonalService {
    PersonalColor getPersonalById(Long personalId);
}