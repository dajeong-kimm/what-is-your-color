package com.ssafy.yourcolors.domain.photo.service;

import com.google.zxing.WriterException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface QrCodeService {
    String uploadFile(MultipartFile file) throws IOException;
    byte[] generateQrCode(String fileName) throws IOException, WriterException;
    byte[] downloadFile(String fileName) throws IOException;
    void cleanOldFiles();
}
