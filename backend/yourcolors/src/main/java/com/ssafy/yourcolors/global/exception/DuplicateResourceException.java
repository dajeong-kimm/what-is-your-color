package com.ssafy.yourcolors.global.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends CustomException {
    public DuplicateResourceException(String message) {
        super(HttpStatus.CONFLICT, message); // 409 Conflict 상태 코드 설정
    }
}
