package com.ssafy.yourcolors.domain.photo.controller;

import com.google.zxing.WriterException;
import com.ssafy.yourcolors.domain.photo.service.QrCodeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/photos")
public class QrCodeController {

    @Value("${custom.server.ip}")
    private String serverIp;

    private final QrCodeService qrCodeService;

    public QrCodeController(QrCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    // ✅ 1️⃣ 이미지 업로드 및 QR 코드 생성
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println(file);
        try {
            String fileName = qrCodeService.uploadFile(file);
            String fileDownloadUrl = serverIp + "/api/photos/download/" + fileName;
            String qrCodeUrl = serverIp + "/api/photos/qrcode/" + fileName;

            return ResponseEntity.ok().body("{ \"qr_code_url\": \"" + qrCodeUrl + "\", \"file_url\": \"" + fileDownloadUrl + "\" }");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{ \"error\": \"" + e.getMessage() + "\" }");
        }
    }

    // ✅ 2️⃣ QR 코드 즉석 생성 (서버 저장 X)
    @GetMapping("/qrcode/{fileName}")
    public ResponseEntity<byte[]> generateQrCode(@PathVariable String fileName) {
        try {
            byte[] qrCode = qrCodeService.generateQrCode(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrCode);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // ✅ 3️⃣ 원본 이미지 다운로드
    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) {
        try {
            byte[] fileBytes = qrCodeService.downloadFile(fileName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    // ✅ 4️⃣ 이미지 직접 보기
    @GetMapping("/view/{fileName}")
    public ResponseEntity<byte[]> viewFile(@PathVariable String fileName) {
        try {
            byte[] fileBytes = qrCodeService.downloadFile(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // 이미지 미디어 타입 지정
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

}
