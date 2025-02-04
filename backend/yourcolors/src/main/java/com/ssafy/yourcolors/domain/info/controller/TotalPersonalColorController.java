package com.ssafy.yourcolors.domain.info.controller;

import com.ssafy.yourcolors.domain.info.dto.TotalPersonalColorResponseDto;
import com.ssafy.yourcolors.domain.info.service.TotalPersonalColorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/info")
@RequiredArgsConstructor
@Tag(name = "Personal Color API", description = "퍼스널 컬러 관련 API") // Swagger 그룹 태그 추가
public class TotalPersonalColorController {

    private final TotalPersonalColorService totalPersonalColorService;

    @Operation(
            summary = "전체 퍼스널 컬러 및 태그 목록 조회",
            description = "퍼스널 컬러 전체 목록을 조회합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = TotalPersonalColorResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "요청한 페이지를 찾을 수 없음",
                    content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/tag-list")
    public ResponseEntity<TotalPersonalColorResponseDto> getTotalPersonalColors() {
        return ResponseEntity.ok(totalPersonalColorService.getAllPersonalColors());
    }
}
