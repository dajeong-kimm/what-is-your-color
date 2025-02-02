package com.ssafy.yourcolors.global.exception;

import org.springframework.http.HttpStatus;

public class ExternalServiceException extends CustomException {
    public ExternalServiceException(String message) {
        super(HttpStatus.SERVICE_UNAVAILABLE, message); // 503 Service Unavailable 상태 코드 설정
    }
}
