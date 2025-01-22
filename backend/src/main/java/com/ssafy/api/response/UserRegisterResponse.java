package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserRegisterResponse")
@Getter
@Setter
public class UserRegisterResponse extends BaseResponseBody {

    @ApiModelProperty(name = "Message", example = "Success")
    private String message;

    public static UserRegisterResponse of(Integer statusCode, String message) {
        UserRegisterResponse res = new UserRegisterResponse();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        return res;
    }

    // Getters and Setters
}
