package com.ssafy.yourcolors.domain.result.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.ssafy.yourcolors.domain.result.dto.QrResponseDto;
import com.ssafy.yourcolors.domain.result.util.MailManager;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    @Value("${custom.server.ip}")
    private String serverIp;

    private final MailManager mailManager;

//    private final Map<String, Map<String, String>> qrStorage = new HashMap<>();
    private final QrStorage qrStorage;

    @Override
    public String sendEmail(String email, MultipartFile image, String bestColor, String subColor1, String subColor2, String message) throws IOException {
        String subject = "퍼스널 컬러 진단 결과 안내";

        String content = String.format(
                """
                <html>
                    <body>
                        <h2>퍼스널 컬러 진단 결과</h2>
                        <p><strong>베스트 컬러:</strong> %s</p>
                        <p><strong>서브 컬러:</strong> %s, %s</p>
                        <p><strong>진단 메시지:</strong> %s</p>
                        <br>
                        <p>더 자세한 내용은 <a href="https://yourwebsite.com/result">여기</a>에서 확인하세요.</p>
                    </body>
                </html>
                """,
                bestColor, subColor1, subColor2, message
        );

        try {
            mailManager.send(email, subject, content, image);
            return "이메일이 성공적으로 전송되었습니다.";
        } catch (MessagingException e) {
            return "이메일 전송 실패: " + e.getMessage();
        }
    }




    @Override
    public QrResponseDto generateQrCode(MultipartFile image, String bestColor, String subColor1, String subColor2, String message) throws IOException {
        String qrId = UUID.randomUUID().toString();
        String resultUrl = serverIp + "/api/result/view/" + qrId;

        // 진단 데이터 저장
        Map<String, String> resultData = new HashMap<>();
        resultData.put("bestColor", bestColor);
        resultData.put("subColor1", subColor1);
        resultData.put("subColor2", subColor2);
        resultData.put("message", message);
        resultData.put("imageBase64", Base64.getEncoder().encodeToString(image.getBytes())); // Base64 인코딩된 이미지 저장
//        qrStorage.put(qrId, resultData);
        qrStorage.save(qrId, resultData);

        System.out.println("Generated qrId: " + qrId);

        // QR 코드 생성
        String qrBase64 = generateQrCodeBase64(resultUrl);

        System.out.println("Generated QR URL: " + resultUrl);
        getResultView(qrId);

        return new QrResponseDto(qrBase64);
    }

    @Override
    public String getResultView(String qrId) {
        System.out.println("Requested qrId: " + qrId);
        if (!qrStorage.contains(qrId)) {
            return "<h1>존재하지 않는 QR 코드입니다.</h1>";
        }

        Map<String, String> resultData = qrStorage.findById(qrId);
        return String.format("""
        <html>
            <head>
                <title>퍼스널 컬러 진단 결과</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        background-color: #d2f096; /* 배경색 추가 */
                        color: black; /* 전체 글자 색 */
                        margin: 0;
                        padding: 20px;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: auto; 
                        padding: 20px; 
                        border-radius: 10px; 
                    }
                    h2 {
                        color: #ffffff; /* 제목 색상 강조 */
                    }
                    img { 
                        max-width: 100%%; 
                        height: auto; 
                        border-radius: 10px; 
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>퍼스널 컬러 진단 결과</h2>
                    <img src="data:image/png;base64,%s" alt="진단 이미지">
                    <p><strong>베스트 컬러:</strong> %s</p>
                    <p><strong>서브 컬러:</strong> %s, %s</p>
                    <p><strong>진단 메시지:</strong> %s</p>
                </div>
            </body>
        </html>
        """,
                resultData.get("imageBase64"),
                resultData.get("bestColor"),
                resultData.get("subColor1"),
                resultData.get("subColor2"),
                resultData.get("message")
        );
    }

    private String generateQrCodeBase64(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, StandardCharsets.UTF_8.name());
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200, hints);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] qrBytes = pngOutputStream.toByteArray();

            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrBytes);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("QR 코드 생성 실패", e);
        }
    }





}
