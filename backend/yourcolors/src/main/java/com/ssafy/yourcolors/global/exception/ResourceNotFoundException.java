package com.ssafy.yourcolors.global.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends CustomException{
    public ResourceNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message); // 404 Not Found 상태 코드 설정
    }
}
