package com.ssafy.yourcolors.domain.personal.dto;
//퍼스널 컬러 검증 API
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonalColorResponseDto {
    private String status;
    private String bestPersonalColor;
    private String worstPersonalColor;
    private double confidence;
    private String message;
}