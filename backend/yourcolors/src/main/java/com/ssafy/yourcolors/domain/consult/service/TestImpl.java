package com.ssafy.yourcolors.domain.consult.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.yourcolors.domain.consult.dto.AiResponse;
import com.ssafy.yourcolors.domain.consult.dto.DistResponse;
import com.ssafy.yourcolors.domain.consult.entity.ConsultPersonalColor;
import com.ssafy.yourcolors.domain.consult.repository.PersonalColorRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TestImpl implements ConsultService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String FLASK_AI = "http://3.35.236.198:5000/predict/model";
    private final String FLASK_DIST = "http://3.35.236.198:5000/predict/colordist";
    private final String GPT_API_URL = "https://api.openai.com/v1/chat/completions";
    private final String GPT_API_KEY = "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";

    private final PersonalColorRepository personalColorRepository;

    public TestImpl(PersonalColorRepository personalColorRepository) {
        this.personalColorRepository = personalColorRepository;
    }


    @Override
    public AiResponse consultWithAI(MultipartFile image) {
        List<AiResponse.Result> results = processAiResponse(image);
        String gptSummary = callGptApiForAI(results); // AI 모델용 GPT API 호출
        System.out.println("result >>> " + results.get(0).getPersonalColor());

        return new AiResponse(results, gptSummary);
    }

    @Override
    public DistResponse consultWithDist(MultipartFile face, MultipartFile a4) {
        List<DistResponse.Result> results = processDistEResponse(face, a4);
        String gptSummary = callGptApiForDist(results); // Dist 모델용 GPT API 호출

        System.out.println("result : " + results.get(0).getPersonalColor());
        return new DistResponse(results, gptSummary);
    }

    /**
     * AI 모델을 통한 퍼스널 컬러 진단
     */
    private List<AiResponse.Result> processAiResponse(MultipartFile image) {
        ResponseEntity<List<Map<String, String>>> response = sendToFlaskAI(image);

        if (response == null || response.getBody() == null || response.getBody().isEmpty()) {
            return List.of();
        }

        return response.getBody().stream()
                .map(item -> {
                    double probability = Double.parseDouble(item.get("probability").replace("%", ""));
                    String formattedColor = formatPersonalColor(item.get("class_name"));
                    // personal_color 테이블에서 name이 formattedColor와 일치하는 personal_id 조회
                    int personalId = personalColorRepository.findByName(formattedColor)
                            .map(ConsultPersonalColor::getPersonalId)
                            .orElse(0); // 없을 경우 기본값 0 또는 예외 처리 가능
                    return new AiResponse.Result(probability, formattedColor, personalId);
                })
                .collect(Collectors.toList());
    }

    /**
     * 색상 거리 기반 퍼스널 컬러 진단
     */
    private List<DistResponse.Result> processDistEResponse(MultipartFile face, MultipartFile a4) {
        ResponseEntity<Map<String, Object>> response = sendToFlaskDist(face, a4);

        if (response == null || response.getBody() == null) {
            return List.of();
        }

        String key = (a4 == null || a4.isEmpty()) ? "original_image" : "corrected_image";

        Object imageData = response.getBody().get(key);
        if (!(imageData instanceof Map)) {
            return List.of();
        }

        Map<String, Object> selectedImageData = (Map<String, Object>) imageData;
        Object diagnosisObj = selectedImageData.get("diagnosis");

        if (!(diagnosisObj instanceof List)) {
            return List.of();
        }

        List<Map<String, Object>> diagnosisList = (List<Map<String, Object>>) diagnosisObj;

        return diagnosisList.stream().filter(item -> ((Number) item.get("rank")).intValue() <= 3).map(item -> {
            int rank = ((Number) item.get("rank")).intValue();
            // 원본 personal_color 값 가져오기
            String formattedColor = (String) item.get("personal_color");
            // personal_color 테이블에서 formattedColor와 일치하는 personalId 조회
            int personalId = personalColorRepository.findByName(formattedColor)
                    .map(ConsultPersonalColor::getPersonalId)
                    .orElse(0);
            return new DistResponse.Result(rank, formattedColor, personalId);
        }).collect(Collectors.toList());
    }

    /**
     * Flask AI 모델과 통신 (multipart/form-data 방식)
     */
    private ResponseEntity<List<Map<String, String>>> sendToFlaskAI(MultipartFile image) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", image.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            return restTemplate.exchange(FLASK_AI, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {
            });
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ofNullable(List.of());
        }
    }

    /**
     * Flask Dist 모델과 통신 (multipart/form-data 방식)
     */
    private ResponseEntity<Map<String, Object>> sendToFlaskDist(MultipartFile face, MultipartFile a4) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("face_image", face.getResource());
        if (a4 != null) {
            body.add("a4_image", a4.getResource());
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            return restTemplate.exchange(FLASK_DIST, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {
            });
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ofNullable(Map.of());
        }
    }

    /**
     * GPT API 호출 (퍼스널 컬러에 따른 추천)
     */
    private String callGptApiForAI(List<AiResponse.Result> results) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(GPT_API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // GPT 프롬프트 생성
        String prompt = generatePromptForAI(results);

        // 요청 JSON 데이터 생성 (Chat API 형식)
        Map<String, Object> requestBodyMap = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "너는 퍼스널 컬러 컨설턴트야. 요청에 따라 퍼스널 컬러에 맞는 추천을 해줘."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7,
                "max_tokens", 1000
        );

        try {
            String requestBody = objectMapper.writeValueAsString(requestBodyMap);
            System.out.println("🔍 OpenAI API 요청 JSON: " + requestBody);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(GPT_API_URL, request, String.class);
            System.out.println("✅ OpenAI API 응답: " + response.getBody());

            // 응답 JSON 파싱
            String responseBody = response.getBody();
            JsonNode root = objectMapper.readTree(responseBody);
            // choices 배열의 첫번째 요소의 message.content 값을 추출
            String messageContent = root.path("choices").get(0).path("message").path("content").asText();

            return messageContent;
        } catch (Exception e) {
            e.printStackTrace();
            return "GPT API 호출 중 오류 발생";
        }
    }


    /**
     * GPT API 호출 (색상 거리 기반 분석 결과)
     */
    private String callGptApiForDist(List<DistResponse.Result> results) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(GPT_API_KEY);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = generatePromptForDist(results);

        Map<String, Object> requestBodyMap = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "system", "content", "너는 퍼스널 컬러 컨설턴트야. 요청에 따라 퍼스널 컬러에 맞는 추천을 해줘."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.7,
                "max_tokens", 1000
        );

        try {
            String requestBody = objectMapper.writeValueAsString(requestBodyMap);
            System.out.println("🔍 OpenAI API 요청 JSON: " + requestBody);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(GPT_API_URL, request, String.class);
            System.out.println("✅ OpenAI API 응답: " + response.getBody());

            // 응답 JSON 파싱
            String responseBody = response.getBody();
            JsonNode root = objectMapper.readTree(responseBody);
            String messageContent = root.path("choices").get(0).path("message").path("content").asText();

            return messageContent;
        } catch (Exception e) {
            e.printStackTrace();
            return "GPT API 호출 중 오류 발생";
        }
    }


    private String generatePromptForAI(List<AiResponse.Result> results) {
        if (results.isEmpty()) {
            return "퍼스널 컬러 정보를 분석할 수 없습니다.";
        }

        results.sort(Comparator.comparingDouble(AiResponse.Result::getProbability).reversed());

        String mainColor = results.get(0).getPersonalColor();
        String subColor1 = results.size() > 1 ? results.get(1).getPersonalColor() : "없음";
        String subColor2 = results.size() > 2 ? results.get(2).getPersonalColor() : "없음";

        return String.format("""
                    너는 퍼스널 컬러 컨설턴트야.
                    사용자의 퍼스널 컬러 정보를 기반으로 어울리는 **악세사리(안경, 목걸이, 귀걸이, 팔찌, 반지), 향수, 옷 컬러**를 추천해줘.
                    결과는 다음 형식을 따라야 해.
                    
                    🌸 **퍼스널 컬러 컨설팅 결과** 🌸
                    
                    👓 **안경**: 
                    💍 **악세사리**: 
                    🫧 **향수**: 
                    👗 **옷 컬러**: 
                    - **메인**: 
                    - **포인트**: 
                    
                    사용자 정보: 
                    - **메인 컬러**: %s 
                    - **서브 컬러**: %s, %s 
                  
                    결과는 친절한 컨설턴트 말투로 자연스럽게 설명해줘.
                    **최종 추천 요약을 250자 내로 간결하게 작성해줘.**
                """, mainColor, subColor1, subColor2);
    }

    private String generatePromptForDist(List<DistResponse.Result> results) {
        if (results.isEmpty()) {
            return "퍼스널 컬러 정보를 분석할 수 없습니다.";
        }

        results.sort(Comparator.comparingInt(DistResponse.Result::getRank));

        String mainColor = results.get(0).getPersonalColor();
        String subColor1 = results.size() > 1 ? results.get(1).getPersonalColor() : "없음";
        String subColor2 = results.size() > 2 ? results.get(2).getPersonalColor() : "없음";

        return String.format("""
                    너는 퍼스널 컬러 컨설턴트야.
                    사용자의 퍼스널 컬러 정보를 기반으로 어울리는 **악세사리(안경, 목걸이, 귀걸이, 팔찌, 반지), 향수, 옷 컬러**를 추천해줘.
                    결과는 다음 형식을 따라야 해.
                    
                    🌸 **퍼스널 컬러 컨설팅 결과** 🌸
                    
                    👓 **안경**: 
                    💍 **악세사리**: 
                    🫧 **향수**: 
                    👗 **옷 컬러**: 
                    - **메인**: 
                    - **포인트**: 
                    
                    사용자 정보: 
                    - **메인 컬러**: %s 
                    - **서브 컬러**: %s, %s 
                  
                    결과는 친절한 컨설턴트 말투로 자연스럽게 설명해줘.
                """, mainColor, subColor1, subColor2);
    }

    private String formatPersonalColor(String personalColor) {
        if (personalColor == null || personalColor.isEmpty()) {
            return "알 수 없음";
        }

        // 언더바(_)를 공백(" ")으로 변경
        personalColor = personalColor.replace("_", " ");

        // 계절에 따라 "웜" 또는 "쿨" 추가
        if (personalColor.startsWith("봄") || personalColor.startsWith("가을")) {
            personalColor = personalColor.replaceFirst(" ", " 웜 ");
        } else if (personalColor.startsWith("여름") || personalColor.startsWith("겨울")) {
            personalColor = personalColor.replaceFirst(" ", " 쿨 ");
        }

        return personalColor;
    }
}