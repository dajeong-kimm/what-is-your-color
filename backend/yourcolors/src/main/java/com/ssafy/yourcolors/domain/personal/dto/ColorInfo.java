package com.ssafy.yourcolors.domain.personal.dto;

import lombok.Data;

@Data
public class ColorInfo {
    private String color;
    private String name;

    public ColorInfo(String color, String name) {
        this.color = color;
        this.name = name;
    }
}