package com.ssafy.yourcolors.domain.result.service;

import com.ssafy.yourcolors.domain.result.dto.EmailRequestDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ResultService {
    String sendEmail(String email, MultipartFile image, String bestColor, String subColor1, String subColor2, String message) throws IOException;
}
