package com.ssafy.yourcolors.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class CustomException extends RuntimeException {
    private final HttpStatus status; // HTTP 상태 코드 (예: 400, 404, 500 등)
    private final String message;    // 에러 메시지

    protected CustomException(HttpStatus status, String message) {
        super(message);             // RuntimeException의 메시지 설정
        this.status = status;       // 예외에 해당하는 HTTP 상태 코드 저장
        this.message = message;     // 에러 메시지 저장
    }
}
