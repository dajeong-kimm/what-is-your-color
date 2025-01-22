// src/common/api/userAPI.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',  // 실제 백엔드 URL로 변경
});

export const registerUser = (userData) => {
  return api.post('/users', userData);
};

export const checkUserId = (userId) => {
  return api.get(`/users/${userId}`);
};
