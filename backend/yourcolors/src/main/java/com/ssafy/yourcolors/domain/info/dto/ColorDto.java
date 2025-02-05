package com.ssafy.yourcolors.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColorDto {
    private String hex;  // HEX 값
    private int r;       // Red
    private int g;       // Green
    private int b;       // Blue
}
