package com.ssafy.yourcolors.domain.consult.service;

import com.ssafy.yourcolors.domain.consult.dto.AiResponse;
import com.ssafy.yourcolors.domain.consult.dto.DistResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ConsultService {

    AiResponse consultWithAI(MultipartFile image);
    DistResponse consultWithDist(MultipartFile face, MultipartFile a4);

}
