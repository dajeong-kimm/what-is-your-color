package com.ssafy.yourcolors.domain.result.service;

import com.ssafy.yourcolors.domain.result.dto.EmailRequestDto;
import com.ssafy.yourcolors.domain.result.dto.QrRequestDto;
import com.ssafy.yourcolors.domain.result.util.MailManager;
import com.ssafy.yourcolors.domain.result.util.QrCodeGenerator;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {
    private final MailManager mailManager;
    private final QrCodeGenerator qrCodeGenerator;

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
    public String generateQrCode(MultipartFile image, String bestColor, String subColor1, String subColor2, String message) {
        // ✅ 1. 이미지 저장
        String imageUrl = saveImage(image);

        // ✅ 2. QR 코드 내용 JSON 생성
        String qrContent = String.format(
                "{ \"image\": \"%s\", \"bestColor\": \"%s\", \"subColors\": [\"%s\", \"%s\"], \"message\": \"%s\" }",
                imageUrl, bestColor, subColor1, subColor2, message
        );

        System.out.println("QR 코드 내용: " + qrContent);

        // ✅ 3. QR 코드 생성
        return qrCodeGenerator.generateQrCode(qrContent);
    }

    // ✅ 이미지 저장 로직 (src/main/resources/static/qrcodes/)
    private String saveImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return "null";  // 이미지가 없으면 "null" 반환
        }

        try {
            // ✅ 저장할 폴더 경로
            String folderPath = "src/main/resources/static/qrcodes/";
            File folder = new File(folderPath);
            if (!folder.exists()) {
                folder.mkdirs();  // 폴더 없으면 생성
            }

            // ✅ 저장할 파일명
            String filename = UUID.randomUUID() + ".png";
            Path path = Paths.get(folderPath + filename);
            Files.write(path, image.getBytes());

            // ✅ 🚀 풀 URL 반환 (ex: http://localhost:9000/qrcodes/파일명.png)
            return "http://localhost:9000/qrcodes/" + filename;

        } catch (IOException e) {
            e.printStackTrace();
            return "null";  // 저장 실패 시 "null" 반환
        }
    }




}
