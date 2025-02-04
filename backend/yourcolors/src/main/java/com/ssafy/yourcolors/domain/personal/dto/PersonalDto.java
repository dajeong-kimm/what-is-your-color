package com.ssafy.yourcolors.domain.personal.dto;

import com.ssafy.yourcolors.domain.personal.entity.PersonalColor;
import com.ssafy.yourcolors.domain.personal.entity.PersonalColorHashtag;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
//퍼스널 컬러 상세 정보 조회 API 실행을 위한 Dto
public class PersonalDto {
    private Integer personalId;
    private String name;
    private String description;
    private List<String> hashtags;
    private List<ColorInfo> bestColors;
    private List<ColorInfo> worstColors;

    public PersonalDto(PersonalColor personal) {
        this.personalId = personal.getPersonalId();
        this.name = personal.getName();
        this.description = personal.getDescription();
        this.hashtags = personal.getHashtags().stream()
                .map(PersonalColorHashtag::getHashtag)
                .collect(Collectors.toList());
        this.bestColors = personal.getBestColors().stream()
                .map(bc -> new ColorInfo(bc.getColor(), bc.getName()))
                .collect(Collectors.toList());
        this.worstColors = personal.getWorstColors().stream()
                .map(wc -> new ColorInfo(wc.getColor(), wc.getName()))
                .collect(Collectors.toList());
    }
}