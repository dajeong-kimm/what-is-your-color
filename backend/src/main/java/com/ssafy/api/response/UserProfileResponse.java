package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserProfileResponse")
@Getter
@Setter
public class UserProfileResponse {

    @ApiModelProperty(name = "Department", example = "Development")
    private String department;

    @ApiModelProperty(name = "Position", example = "Manager")
    private String position;

    @ApiModelProperty(name = "Name", example = "John Doe")
    private String name;

    @ApiModelProperty(name = "User ID", example = "johndoe")
    private String userId;

    // Constructor, Getters, and Setters
}
