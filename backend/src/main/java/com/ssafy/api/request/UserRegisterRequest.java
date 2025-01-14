package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserRegisterRequest")
@Getter
@Setter
public class UserRegisterRequest {

    @ApiModelProperty(name = "Department", example = "Development")
    private String department;

    @ApiModelProperty(name = "Position", example = "Manager")
    private String position;

    @ApiModelProperty(name = "Name", example = "John Doe")
    private String name;

    @ApiModelProperty(name = "User ID", example = "johndoe")
    private String userId;

    @ApiModelProperty(name = "Password", example = "password123")
    private String password;

    // Getters and Setters
}
