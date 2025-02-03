package com.ssafy.yourcolors.global.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedAccessException extends CustomException {
    public UnauthorizedAccessException(String message) {
        super(HttpStatus.UNAUTHORIZED, message); // 401 Unauthorized 상태 코드 설정
    }
}
