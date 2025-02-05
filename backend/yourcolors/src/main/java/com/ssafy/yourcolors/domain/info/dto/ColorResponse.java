package com.ssafy.yourcolors.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ColorResponse {
    private int size;            // 배열 크기
    private List<ColorDto> colors; // 색상 리스트
}
