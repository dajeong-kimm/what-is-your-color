package com.ssafy.yourcolors.domain.test.controller;

import com.ssafy.yourcolors.global.exception.CustomException;
//import com.ssafy.yourcolors.global.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/test") // API 버전 추가
public class TestController {

    @GetMapping("/success")
    public String testSuccess() {
        log.info("Test success endpoint called");
        return "Success!";
    }

//    @GetMapping("/error/{id}")
//    public String testError(@PathVariable Long id) {
//        if (id == 0) {
//            throw new CustomException(ErrorCode.USER_NOT_FOUND);
//        }
//        return "User found with id: " + id;
//    }
}