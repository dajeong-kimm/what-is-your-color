package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.TotalPersonalColorResponseDto;
import com.ssafy.yourcolors.domain.info.entity.Hashtag;
import com.ssafy.yourcolors.domain.info.entity.PersonalColor;
import com.ssafy.yourcolors.domain.info.repository.PersonalColorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TotalPersonalColorServiceImpl implements TotalPersonalColorService {

    private final PersonalColorRepository personalColorRepository;

    @Override
    public TotalPersonalColorResponseDto getAllPersonalColors() {
        List<PersonalColor> personalColors = personalColorRepository.findAll();

        List<TotalPersonalColorResponseDto.PersonalColorInfo> colorInfoList = personalColors.stream()
                .map(color ->
                        TotalPersonalColorResponseDto.PersonalColorInfo.builder()
                                .personalId(color.getPersonalId())
                                .name(color.getName())
                                .englishName((color.getEnglishName()))
                                .description(color.getDescription())
                                .hashtag(color.getHashtags().stream()
                                        .map(Hashtag::getHashtag)
                                        .collect(Collectors.toList()))
                                .build())
                .collect(Collectors.toList());

        return TotalPersonalColorResponseDto.builder()
                .color_cnt(colorInfoList.size())
                .personalColors(colorInfoList)
                .build();
    }
}