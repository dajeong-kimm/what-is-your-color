package com.ssafy.yourcolors.domain.result.service;

import com.google.zxing.WriterException;
import com.ssafy.yourcolors.domain.result.dto.EmailRequestDto;
import com.ssafy.yourcolors.domain.result.dto.QrResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface ResultService {
    String sendEmail(String email, MultipartFile image, String bestColor, String subColor1, String subColor2, String message) throws IOException;
    QrResponseDto generateQrCode(MultipartFile image, String bestColor, String subColor1, String subColor2, String message) throws IOException;
    String getResultView(String qrId);
}
