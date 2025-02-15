package com.ssafy.yourcolors.domain.photo.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class PhotoMailManager {
    @Value("${spring.mail.username}")
    private String sender;

    private final JavaMailSender javaMailSender;

    public void send(String sendTo, String subject, String content, MultipartFile image) throws MessagingException, IOException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        mimeMessage.setFrom(new InternetAddress(sender, "YourColors", "UTF-8"));
//        mimeMessage.setFrom(sender);
        mimeMessage.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(sendTo));
        mimeMessage.setSubject(subject);

        // 이메일 본문
        MimeBodyPart textPart = new MimeBodyPart();
        textPart.setContent(content, "text/html; charset=utf-8");

        // 이미지 첨부파일
        MimeBodyPart imagePart = new MimeBodyPart();
        imagePart.setFileName(image.getOriginalFilename());
        imagePart.setContent(image.getBytes(), image.getContentType());

        // 메일 본문 + 이미지 결합
        MimeMultipart multipart = new MimeMultipart();
        multipart.addBodyPart(textPart);
        multipart.addBodyPart(imagePart);

        mimeMessage.setContent(multipart);
        javaMailSender.send(mimeMessage);
    }

}
