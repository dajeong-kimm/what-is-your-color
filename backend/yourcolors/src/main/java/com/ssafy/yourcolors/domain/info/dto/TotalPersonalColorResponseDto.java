package com.ssafy.yourcolors.domain.info.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@NoArgsConstructor
public class TotalPersonalColorResponseDto {
    private int color_cnt;
    private List<PersonalColorInfo> personalColors;

    @Builder
    public TotalPersonalColorResponseDto(int color_cnt, List<PersonalColorInfo> personalColors) {
        this.color_cnt = color_cnt;
        this.personalColors = personalColors;
    }

    @Getter
    @NoArgsConstructor
    public static class PersonalColorInfo {
        private Integer personalId;
        private String name;
        private String englishName;
        private String description;
        private List<String> hashtag;

        @Builder
        public PersonalColorInfo(Integer personalId, String name, String englishName, String description, List<String> hashtag) {
            this.personalId = personalId;
            this.name = name;
            this.englishName = englishName;
            this.description = description;
            this.hashtag = hashtag;
        }
    }
}