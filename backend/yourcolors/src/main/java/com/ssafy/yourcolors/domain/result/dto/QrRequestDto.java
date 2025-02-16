package com.ssafy.yourcolors.domain.result.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QrRequestDto {
    private MultipartFile image;  // ✅ 이미지 파일 추가
    private String bestColor;
    private String subColor1;
    private String subColor2;
    private String message;
}