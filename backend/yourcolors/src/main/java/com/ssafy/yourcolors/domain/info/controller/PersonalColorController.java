package com.ssafy.yourcolors.domain.info.controller;

import com.ssafy.yourcolors.domain.info.dto.PersonalColorInfoResponse;
import com.ssafy.yourcolors.domain.info.service.PersonalColorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
@RequiredArgsConstructor
@Tag(name = "Personal Color API", description = "Personal Color 관련 API") // Swagger에서 해당 컨트롤러를 그룹으로 표시
public class PersonalColorController {

    private final PersonalColorService personalColorService;

    @Operation(
            summary = "Personal Color 정보 조회",
            description = "personal ID로 Personal Color 정보를 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = PersonalColorInfoResponse.class))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 Personal ID",
                    content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{personal-id}")
    public ResponseEntity<PersonalColorInfoResponse> getPersonalColor(
            @PathVariable("personal-id") int personalId) {
        return ResponseEntity.ok(personalColorService.getPersonalColorInfo(personalId));
    }
}
