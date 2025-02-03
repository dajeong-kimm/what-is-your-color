package com.ssafy.yourcolors.domain.test.controller;

import com.ssafy.yourcolors.global.exception.InvalidInputException;
import com.ssafy.yourcolors.global.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExceptionTestController {
    @GetMapping("/api/test/not-found")
    public String testNotFound() {
        throw new ResourceNotFoundException("리소스를 찾을 수 없습니다.");
    }

    @GetMapping("/api/test/invalid-input")
    public String testInvalidInput(@RequestParam(required = false) String name) {
        if (name == null || name.isEmpty()) {
            throw new InvalidInputException("유효하지 않은 입력입니다.");
        }
        return "정상 처리되었습니다.";
    }
}
