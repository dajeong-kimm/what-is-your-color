package com.ssafy.yourcolors.domain.personal.service;

import com.ssafy.yourcolors.domain.personal.dto.PersonalColorResponseDto;
import com.ssafy.yourcolors.domain.personal.entity.PersonalColor;
import com.ssafy.yourcolors.domain.personal.repository.PersonalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalServiceImpl implements PersonalService {
    @Autowired
    private PersonalRepository personalRepository;

    @Override
    public PersonalColorResponseDto analyzePersonalColor(String imageUrl) {
        // TODO: 실제 AI 모델 호출 (API 요청 or 직접 분석)
        // 예제 데이터 반환 (테스트용)
        String bestColor = "Spring Light";
        String worstColor = "Light Warm";
        double confidence = 0.92;

        return new PersonalColorResponseDto("success", bestColor, worstColor, confidence, "분석이 완료되었습니다.");
    }

    @Override
    public PersonalColor getPersonalById(Long personalId) {
        return personalRepository.findById(personalId)
                .orElseThrow(() -> new IllegalArgumentException("Personal color not found"));
    }
}