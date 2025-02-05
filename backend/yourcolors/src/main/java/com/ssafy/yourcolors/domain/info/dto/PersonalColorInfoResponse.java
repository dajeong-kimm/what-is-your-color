package com.ssafy.yourcolors.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PersonalColorInfoResponse {
    private int personalId;
    private String name;
    private String description;
    private List<String> hashtag;
    private List<String> bestcolor;
    private List<String> bestcolorName;
    private List<String> worstcolor;
    private List<String> worstcolorName;
    private List<String> fashion;
    private List<String> lip;
    private List<String> chic;
    private List<String> eye;
}
