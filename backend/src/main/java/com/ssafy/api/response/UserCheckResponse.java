package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserCheckResponse")
@Getter
@Setter
public class UserCheckResponse extends BaseResponseBody {

    @ApiModelProperty(name = "Message", example = "이미 존재하는 유저입니다.")
    private String message;

    public static UserCheckResponse of(Integer statusCode, String message) {
        UserCheckResponse res = new UserCheckResponse();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        return res;
    }

    // Getters and Setters
}
