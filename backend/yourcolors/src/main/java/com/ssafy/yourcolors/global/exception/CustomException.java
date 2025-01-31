package com.ssafy.yourcolors.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    // 사용자 정의 예외 클래스 (최상위)
    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}

