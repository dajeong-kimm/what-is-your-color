package com.ssafy.yourcolors.domain.result.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QrResponseDto {
    private String qrUrl; // QR 코드 이미지 URL
}