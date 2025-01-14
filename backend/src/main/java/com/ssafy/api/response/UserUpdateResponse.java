package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserUpdateResponse")
@Getter
@Setter
public class UserUpdateResponse extends BaseResponseBody {

    @ApiModelProperty(name = "Message", example = "Success")
    private String message;

    public static UserUpdateResponse of(Integer statusCode, String message) {
        UserUpdateResponse res = new UserUpdateResponse();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        return res;
    }

    // Getters and Setters
}
