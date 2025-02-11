package com.ssafy.yourcolors.domain.result.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequestDto {
    private String email;       // 수신자 이메일
    private String imageUrl;    // 퍼스널 컬러 진단 사진 URL
    private String bestColor;   // 베스트 컬러
    private String subColor1;   // 서브 컬러 1
    private String subColor2;   // 서브 컬러 2
    private String message;     // 진단 메시지
}
