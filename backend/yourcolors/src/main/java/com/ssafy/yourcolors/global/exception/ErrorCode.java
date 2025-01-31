package com.ssafy.yourcolors.global.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // Common
    INVALID_INPUT_VALUE(400, "C001", "Invalid Input Value"),
    RESOURCE_NOT_FOUND(404, "C002", "Resource Not Found"),
    INTERNAL_SERVER_ERROR(500, "C003", "Internal Server Error"),

    // User
    USER_NOT_FOUND(404, "U001", "User Not Found"),
    DUPLICATE_EMAIL(400, "U002", "Email is Duplicate"),

    // Analysis
    ANALYSIS_NOT_FOUND(404, "A001", "Analysis Result Not Found");

    private final int status;
    private final String code;
    private final String message;

    ErrorCode(int status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
