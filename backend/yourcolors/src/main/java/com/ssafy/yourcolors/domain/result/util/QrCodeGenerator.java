package com.ssafy.yourcolors.domain.result.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class QrCodeGenerator {
    private static final String QR_CODE_DIR = "src/main/resources/static/qrcodes/";
    private static final String BASE_URL = "http://localhost:9000/qrcodes/"; // 배포 시 변경

    public String generateQrCode(String content) {
        try {
            Files.createDirectories(Path.of(QR_CODE_DIR));
            String fileName = UUID.randomUUID().toString() + ".png";
            Path filePath = Path.of(QR_CODE_DIR + fileName);

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8"); // ✅ 한글 깨짐 방지

            BitMatrix bitMatrix = new QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, 300, 300, hints);
            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", filePath);
//            System.out.println("QR 코드 저장 경로: " + filePath);
//            System.out.println("QR 코드 내용: " + content);  // ✅ QR 코드에 저장된 데이터 확인용 출력

            // 정적 파일 URL 반환 (배포 시 BASE_URL 변경 가능)
            return BASE_URL + fileName;
        } catch (Exception e) {
            throw new RuntimeException("QR 코드 생성 실패", e);
        }
    }
}
