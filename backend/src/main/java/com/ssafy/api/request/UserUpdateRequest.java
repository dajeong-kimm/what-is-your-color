package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@ApiModel("UserUpdateRequest")
@Getter
@Setter
public class UserUpdateRequest {

    @ApiModelProperty(name = "Department", example = "Development")
    private String department;

    @ApiModelProperty(name = "Position", example = "Manager")
    private String position;

    @ApiModelProperty(name = "Name", example = "John Doe")
    private String name;

    // Getters and Setters
}
