package com.ssafy.yourcolors.domain.personal.service;

import com.ssafy.yourcolors.domain.personal.Entity.PersonalColor;
import com.ssafy.yourcolors.domain.personal.repository.PersonalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalServiceImpl implements PersonalService {
    @Autowired
    private PersonalRepository personalRepository;

    @Override
    public PersonalColor getPersonalById(Long personalId) {
        return personalRepository.findById(personalId)
                .orElseThrow(() -> new IllegalArgumentException("Personal color not found"));
    }
}