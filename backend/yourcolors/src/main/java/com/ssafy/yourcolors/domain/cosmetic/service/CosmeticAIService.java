package com.ssafy.yourcolors.domain.cosmetic.service;

import com.ssafy.yourcolors.domain.cosmetic.dto.CombinedResponseDto;
import com.ssafy.yourcolors.domain.cosmetic.dto.LipResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface CosmeticAIService {
    LipResponseDto predictLip(MultipartFile lipImage) throws Exception;
    CombinedResponseDto predictCombined(MultipartFile faceImage, MultipartFile lipImage) throws Exception;
}
