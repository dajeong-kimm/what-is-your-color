package com.ssafy.api.controller;

import com.ssafy.api.request.UserRegisterRequest;
import com.ssafy.api.request.UserUpdateRequest;
import com.ssafy.api.response.*;
import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("/api/v1/users")
@Api(value = "유저 API", tags = {"User"})
public class UserController {

	@Autowired
	UserService userService;

	/**
	 * 회원가입 API
	 * [POST] /api/v1/users
	 */
	@PostMapping
	@ApiOperation(value = "회원 가입", notes = "유저 정보를 입력받아 회원가입을 수행한다.")
	@ApiResponses({
			@ApiResponse(code = 201, message = "회원가입 성공"),
			@ApiResponse(code = 400, message = "잘못된 요청")
	})
	public ResponseEntity<UserRegisterResponse> register(
			@RequestBody @ApiParam(value = "회원가입 정보", required = true) UserRegisterRequest registerInfo) {

		userService.createUser(registerInfo);
		return ResponseEntity.status(201).body(UserRegisterResponse.of(201, "Success"));
	}

	/**
	 * 내 프로필 조회 API
	 * [GET] /api/v1/users/me
	 */
	@GetMapping("/me")
	@ApiOperation(value = "내 프로필 조회", notes = "로그인한 사용자의 프로필 정보를 조회한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "성공"),
			@ApiResponse(code = 401, message = "인증 실패")
	})
	public ResponseEntity<UserProfileResponse> getUserInfo(@ApiIgnore Authentication authentication) {
		SsafyUserDetails userDetails = (SsafyUserDetails) authentication.getDetails();
		User user = userService.getUserByUserId(userDetails.getUsername());

		UserProfileResponse response = new UserProfileResponse();
		response.setDepartment(user.getDepartment());
		response.setPosition(user.getPosition());
		response.setName(user.getName());
		response.setUserId(user.getUserId());

		return ResponseEntity.ok(response);
	}

	/**
	 * 유저 정보 조회 API
	 * [GET] /api/v1/users/{userId}
	 */
	@GetMapping("/{userId}")
	@ApiOperation(value = "유저 정보 조회", notes = "특정 유저 ID가 존재하는지 확인한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "사용 가능한 ID"),
			@ApiResponse(code = 409, message = "이미 존재하는 유저")
	})
	public ResponseEntity<UserCheckResponse> checkUserExistence(@PathVariable String userId) {
		boolean exists = userService.checkUserExists(userId);
		if (exists) {
			return ResponseEntity.status(409).body(UserCheckResponse.of(409, "이미 존재하는 유저입니다."));
		}
		return ResponseEntity.ok(UserCheckResponse.of(200, "사용 가능한 ID입니다."));
	}

	/**
	 * 유저 정보 수정 API
	 * [PATCH] /api/v1/users/{userId}
	 */
	@PatchMapping("/{userId}")
	@ApiOperation(value = "유저 정보 수정", notes = "유저의 정보를 수정한다.")
	@ApiResponses({
			@ApiResponse(code = 200, message = "수정 성공"),
			@ApiResponse(code = 404, message = "유저 없음")
	})
	public ResponseEntity<UserUpdateResponse> updateUser(
			@PathVariable String userId,
			@RequestBody @ApiParam(value = "수정할 유저 정보", required = true) UserUpdateRequest updateInfo) {

		userService.updateUser(userId, updateInfo);
		return ResponseEntity.ok(UserUpdateResponse.of(200, "Success"));
	}

	/**
	 * 유저 정보 삭제 API
	 * [DELETE] /api/v1/users/{userId}
	 */
	@DeleteMapping("/{userId}")
	@ApiOperation(value = "유저 정보 삭제", notes = "유저의 정보를 삭제하고 관련된 모든 데이터를 제거한다.")
	@ApiResponses({
			@ApiResponse(code = 204, message = "삭제 성공"),
			@ApiResponse(code = 404, message = "유저 없음")
	})
	public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
		userService.deleteUser(userId);
		return ResponseEntity.noContent().build();
	}
}
