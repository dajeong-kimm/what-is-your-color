//package com.ssafy.yourcolors.domain.consult.service;
//
//import com.ssafy.yourcolors.domain.consult.dto.AiResponse;
//import com.ssafy.yourcolors.domain.consult.dto.DistResponse;
//import org.springframework.core.ParameterizedTypeReference;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
////@Service
//public class ConsultServiceImpl implements ConsultService {
//
//    private final RestTemplate restTemplate = new RestTemplate();
//    private final String FLASK_AI = "http://localhost:5000/predict/model";
//    private final String FLASK_DIST = "http://localhost:5000/predict/colordist";
//    private final String GPT_API_URL = "https://api.openai.com/v1/completions";
//    private final String GPT_API_KEY = "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";
//
//    @Override
//    public AiResponse consultWithAI(MultipartFile image) {
//        List<AiResponse.Result> results = processFlaskResponse(image);
//
//        String gptSummary = callGptApi(results);
//        System.out.println("consultWithAI");
//
//        return new AiResponse(results, gptSummary);
//    }
//
//    @Override
//    public DistResponse consultWithDist(MultipartFile face, MultipartFile a4) {
//        List<DistResponse.Result> results = processDeltaEResponse(face, a4);
//
//        String gptSummary = callGptApi(results);
//
//        return new DistResponse(results, gptSummary);
//    }
//
//    private List<AiResponse.Result> processFlaskResponse(MultipartFile image) {
//        ResponseEntity<List<Map<String, Object>>> response = sendToFlask(image);
//
//        // 응답이 null이거나 빈 리스트일 경우 빈 리스트 반환
//        if (response == null || response.getBody() == null || response.getBody().isEmpty()) {
//            return List.of();
//        }
//
//        return response.getBody().stream()
//                .map(item -> new AiResponse.Result(
//                        ((Number) item.get("rank")).intValue(), // 안전한 숫자 변환
//                        formatPersonalColor((String) item.get("personal_color"))
////                        String.valueOf(item.get("percentage")) // 안전한 문자열 변환
//                ))
//                .collect(Collectors.toList());
//    }
//
//    private List<DistResponse.Result> processDeltaEResponse(MultipartFile face, MultipartFile a4) {
//        ResponseEntity<Map<String, Object>> response = sendToFlaskForDist(face, a4);
//
//        // 응답이 null인지 확인
//        if (response == null || response.getBody() == null) {
//            return List.of();
//        }
//
//        String key = (a4 == null || a4.isEmpty()) ? "original_image" : "corrected_image";
//
//        // 선택된 이미지 데이터 가져오기 (key: "original_image" 또는 "corrected_image")
//        Object selectedImageObject = response.getBody().get(key);
//        if (!(selectedImageObject instanceof Map)) {
//            return List.of();
//        }
//
//        Map<String, Object> selectedImageData = (Map<String, Object>) selectedImageObject;
//
//        // "diagnosis" 키에 해당하는 데이터 가져오기
//        Object diagnosisObject = selectedImageData.get("diagnosis");
//        if (!(diagnosisObject instanceof List)) {
//            return List.of();
//        }
//
//        // "diagnosis" 리스트를 올바른 타입으로 변환
//        List<Map<String, Object>> diagnosisList = (List<Map<String, Object>>) diagnosisObject;
//
//        return diagnosisList.stream()
//                .map(item -> new DistResponse.Result(
//                        ((Number) item.get("rank")).intValue(),  // 안전한 숫자 변환
//                        formatPersonalColor((String) item.get("personal_color"))
//                ))
//                .collect(Collectors.toList());
//    }
//
//    private ResponseEntity<List<Map<String, Object>>> sendToFlaskForAI(MultipartFile face) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//        body.add("face", face.getResource());
//
//        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
//
//        try {
//            return restTemplate.exchange(
//                    FLASK_AI,
//                    HttpMethod.POST,
//                    requestEntity,
//                    new ParameterizedTypeReference<List<Map<String, Object>>>() {
//                    }
//            );
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.ofNullable(List.of());
//        }
//    }
//
//    private ResponseEntity<Map<String, Object>> sendToFlaskForDist(MultipartFile face, MultipartFile a4) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//        body.add("face", face.getResource());
//        if (a4 != null) body.add("a4", a4.getResource());
//
//        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
//
//        try {
//            return restTemplate.exchange(
//                    FLASK_DIST,
//                    HttpMethod.POST,
//                    requestEntity,
//                    new ParameterizedTypeReference<Map<String, Object>>() {
//                    }
//            );
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.ofNullable(Map.of());
//        }
//    }
//
//
//    private String callGptApi(List<?> results) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.setBearerAuth(GPT_API_KEY);
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        String prompt = generatePrompt(results);
//
//        String requestBody = String.format("""
//                    {
//                        "model": "gpt-4",
//                        "prompt": "%s",
//                        "max_tokens": 100
//                    }
//                """, prompt);
//
//        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
//        ResponseEntity<String> response = restTemplate.postForEntity(GPT_API_URL, request, String.class);
//
//        return response.getBody();
//    }
//
//    private String generatePrompt(List<?> results) {
//        if (results.isEmpty()) {
//            return "퍼스널 컬러 정보를 분석할 수 없습니다.";
//        }
//
//        // `rank` 기준으로 정렬
//        results.sort((a, b) -> {
//            int rankA = (a instanceof AiResponse.Result) ? ((AiResponse.Result) a).getRank() : ((DistResponse.Result) a).getRank();
//            int rankB = (b instanceof AiResponse.Result) ? ((AiResponse.Result) b).getRank() : ((DistResponse.Result) b).getRank();
//            return Integer.compare(rankA, rankB);
//        });
//
//        // `rank` 1위는 메인 컬러, `rank` 2~3위는 서브 컬러
//        String mainColor = (results.get(0) instanceof AiResponse.Result)
//                ? ((AiResponse.Result) results.get(0)).getPersonalColor()
//                : ((DistResponse.Result) results.get(0)).getPersonalColor();
//
//        String subColor1 = (results.size() > 1)
//                ? ((results.get(1) instanceof AiResponse.Result)
//                ? ((AiResponse.Result) results.get(1)).getPersonalColor()
//                : ((DistResponse.Result) results.get(1)).getPersonalColor())
//                : "없음";
//
//        String subColor2 = (results.size() > 2)
//                ? ((results.get(2) instanceof AiResponse.Result)
//                ? ((AiResponse.Result) results.get(2)).getPersonalColor()
//                : ((DistResponse.Result) results.get(2)).getPersonalColor())
//                : "없음";
//
//        // ✅ 프롬프트 생성
//        return String.format("""
//                    너는 퍼스널 컬러 컨설턴트야.
//                    사용자의 퍼스널 컬러 정보를 기반으로 어울리는 **악세사리(안경, 목걸이, 귀걸이, 팔찌, 반지), 향수, 옷 컬러**를 추천해줘.
//                    결과는 다음 형식을 따라야 해.
//
//                    🌸 **퍼스널 컬러 컨설팅 결과** 🌸
//
//                    👓 **안경**:
//                    💍 **악세사리**:
//                    🫧 **향수**:
//                    👗 **옷 컬러**:
//                    - **메인**:
//                    - **포인트**:
//
//                    사용자 정보:
//                    - **메인 컬러**: %s
//                    - **서브 컬러**: %s, %s
//
//                    결과는 친절한 컨설턴트 말투로 자연스럽게 설명해줘.
//                """, mainColor, subColor1, subColor2);
//    }
//
//
//    private String formatPersonalColor(String personalColor) {
//        personalColor = personalColor.replace("_", " ");
//        if (personalColor.startsWith("봄") || personalColor.startsWith("가을")) {
//            personalColor = personalColor.replaceFirst(" ", " 웜 ");
//        } else if (personalColor.startsWith("여름") || personalColor.startsWith("겨울")) {
//            personalColor = personalColor.replaceFirst(" ", " 쿨 ");
//        }
//        return personalColor;
//    }
//
//
//}
