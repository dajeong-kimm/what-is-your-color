package com.ssafy.yourcolors.global.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BaseResponse<T> {
    private int status;   // HTTP 상태 코드
    private T message;    // 메시지 (제네릭 타입 사용)

    public BaseResponse(int status, T message) {
        this.status = status;
        this.message = message;
    }
}
