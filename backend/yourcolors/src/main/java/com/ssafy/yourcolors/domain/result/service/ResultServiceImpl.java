package com.ssafy.yourcolors.domain.result.service;

import com.ssafy.yourcolors.domain.result.dto.EmailRequestDto;
import com.ssafy.yourcolors.domain.result.util.MailManager;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;


@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {
    private final MailManager mailManager;

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
}
