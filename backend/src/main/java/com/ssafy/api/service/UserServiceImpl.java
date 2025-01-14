package com.ssafy.api.service;

import com.ssafy.api.request.UserRegisterRequest;
import com.ssafy.api.request.UserUpdateRequest;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {

	@Autowired
	UserRepository userRepository;

	@Autowired
	UserRepositorySupport userRepositorySupport;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Override
	public User createUser(UserRegisterRequest userRegisterInfo) {
		User user = new User();
		user.setUserId(userRegisterInfo.getUserId());
		user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
		user.setDepartment(userRegisterInfo.getDepartment());
		user.setPosition(userRegisterInfo.getPosition());
		user.setName(userRegisterInfo.getName());
		return userRepository.save(user);
	}

	@Override
	public User getUserByUserId(String userId) {
		return userRepositorySupport.findUserByUserId(userId)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계정입니다."));
	}

	@Override
	public boolean checkUserExists(String userId) {
		return userRepositorySupport.findUserByUserId(userId).isPresent();
	}

	@Override
	public void updateUser(String userId, UserUpdateRequest updateInfo) {
		User user = getUserByUserId(userId);
		user.setDepartment(updateInfo.getDepartment());
		user.setPosition(updateInfo.getPosition());
		user.setName(updateInfo.getName());
		userRepository.save(user);
	}

	@Override
	public void deleteUser(String userId) {
		User user = getUserByUserId(userId);
		userRepository.delete(user);
	}
}
