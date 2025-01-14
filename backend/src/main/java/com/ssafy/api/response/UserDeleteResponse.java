package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserDeleteResponse")
@Getter
@Setter
public class UserDeleteResponse extends BaseResponseBody {

    @ApiModelProperty(name = "Message", example = "삭제되었습니다.")
    private String message;

    public static UserDeleteResponse of(Integer statusCode, String message) {
        UserDeleteResponse res = new UserDeleteResponse();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        return res;
    }

    // Getters and Setters
}
