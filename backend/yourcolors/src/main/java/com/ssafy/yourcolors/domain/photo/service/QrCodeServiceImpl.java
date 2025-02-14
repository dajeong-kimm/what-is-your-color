package com.ssafy.yourcolors.domain.photo.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class QrCodeServiceImpl implements QrCodeService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + fileExtension;
        Path filePath = Paths.get(uploadDir, fileName);
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    @Override
    public byte[] generateQrCode(String fileName) throws IOException, WriterException {
        String fileDownloadUrl = "http://localhost:9000/api/photos/download/" + fileName;
        BufferedImage qrImage = generateQRCode(fileDownloadUrl);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "png", baos);
        return baos.toByteArray();
    }

    @Override
    public byte[] downloadFile(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        return Files.readAllBytes(filePath);
    }

    @Override
    @Scheduled(fixedRate = 3600000) // 1시간마다 실행
    public void cleanOldFiles() {
        File directory = new File(uploadDir);
        if (!directory.exists()) return;

        File[] files = directory.listFiles();
        if (files != null) {
            Instant now = Instant.now();
            for (File file : files) {
                if (file.lastModified() < now.minus(1, ChronoUnit.DAYS).toEpochMilli()) {
                    file.delete();
                }
            }
        }
    }

    private BufferedImage generateQRCode(String text) throws WriterException {
        int width = 300;
        int height = 300;
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }
}
