package com.ssafy.yourcolors.domain.cosmetic.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.yourcolors.domain.cosmetic.dto.CombinedResponseDto;
import com.ssafy.yourcolors.domain.cosmetic.dto.LipResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CosmeticAIServiceImpl implements CosmeticAIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String FLASK_LIP_URL = "http://3.35.236.198:5000/predict/lip";
    private final String FLASK_COMBINED_URL = "http://3.35.236.198:5000/predict/combined";

    @Autowired
    public CosmeticAIServiceImpl(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public LipResponseDto predictLip(MultipartFile lipImage) throws Exception {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("lip_image", new MultipartInputStreamFileResource(lipImage.getInputStream(), lipImage.getOriginalFilename(), lipImage.getSize()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(FLASK_LIP_URL, HttpMethod.POST, requestEntity, String.class);
        String responseJson = responseEntity.getBody();
        return objectMapper.readValue(responseJson, LipResponseDto.class);
    }

    @Override
    public CombinedResponseDto predictCombined(MultipartFile faceImage, MultipartFile lipImage) throws Exception {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("face_image", new MultipartInputStreamFileResource(faceImage.getInputStream(), faceImage.getOriginalFilename(), faceImage.getSize()));
        body.add("lip_image", new MultipartInputStreamFileResource(lipImage.getInputStream(), lipImage.getOriginalFilename(), lipImage.getSize()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> responseEntity = restTemplate.exchange(FLASK_COMBINED_URL, HttpMethod.POST, requestEntity, String.class);
        String responseJson = responseEntity.getBody();
        return objectMapper.readValue(responseJson, CombinedResponseDto.class);
    }
}
