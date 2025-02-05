package com.ssafy.yourcolors.domain.info.service;

import com.ssafy.yourcolors.domain.info.dto.PersonalColorInfoResponse;

public interface PersonalColorService {
    PersonalColorInfoResponse getPersonalColorInfo(int personalId);
}
