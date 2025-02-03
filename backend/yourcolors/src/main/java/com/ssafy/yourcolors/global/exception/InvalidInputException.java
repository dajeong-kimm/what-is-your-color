package com.ssafy.yourcolors.global.exception;

import org.springframework.http.HttpStatus;

public class InvalidInputException extends CustomException {
    public InvalidInputException(String message) {
        super(HttpStatus.BAD_REQUEST, message); // 400 Bad Request 상태 코드 설정
    }
}
