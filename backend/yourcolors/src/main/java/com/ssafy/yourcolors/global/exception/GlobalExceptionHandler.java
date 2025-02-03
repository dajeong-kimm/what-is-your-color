package com.ssafy.yourcolors.global.exception;

import com.ssafy.yourcolors.global.common.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // CustomException 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<BaseResponse<String>> handleCustomException(CustomException ex) {
        logger.error("CustomException 발생: {}", ex.getMessage(), ex); // 로그 추가
        BaseResponse<String> response = new BaseResponse<>(ex.getStatus().value(), ex.getMessage());
        return new ResponseEntity<>(response, ex.getStatus());
    }

    // 예상하지 못한 일반 Exception 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<String>> handleGenericException(Exception ex) {
        logger.error("예상치 못한 오류 발생: {}", ex.getMessage(), ex); // 로그 추가
        BaseResponse<String> response = new BaseResponse<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 내부 오류가 발생했습니다.");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<String> handleNoResourceFoundException(NoResourceFoundException ex, HttpServletRequest request) {
        if (request.getRequestURI().equals("/favicon.ico")) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content 반환
        }
        return new ResponseEntity<>("리소스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }


}
