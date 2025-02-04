package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.PersonalColorInfoResponse;
import com.ssafy.yourcolors.domain.info.entity.*;
import com.ssafy.yourcolors.domain.info.repository.PersonalColorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonalColorServiceImpl implements PersonalColorService {

    private final PersonalColorRepository personalColorRepository;

    @Override
    public PersonalColorInfoResponse getPersonalColorInfo(int personalId) {
        PersonalColor personalColor = personalColorRepository.findById(personalId)
                .orElseThrow(() -> new RuntimeException("Personal color not found"));

        return new PersonalColorInfoResponse(
                personalColor.getPersonalId(),
                personalColor.getName(),
                personalColor.getDescription(),
                personalColor.getHashtags().stream().map(Hashtag::getHashtag).toList(),
                personalColor.getBestColors().stream().map(BestColor::getColor).toList(),
                personalColor.getBestColors().stream().map(BestColor::getName).toList(),
                personalColor.getWorstColors().stream().map(WorstColor::getColor).toList(),
                personalColor.getWorstColors().stream().map(WorstColor::getName).toList(),
                personalColor.getFashionColors().stream().map(FashionColor::getColor).toList(),
                personalColor.getLipColors().stream().map(LipColor::getColor).toList(),
                personalColor.getChicColors().stream().map(ChicColor::getColor).toList(),
                personalColor.getEyeColors().stream().map(EyeColor::getColor).toList()
        );
    }
}
