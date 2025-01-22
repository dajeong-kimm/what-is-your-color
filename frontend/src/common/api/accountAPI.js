import axios from "axios";

/**
 * 로그인 요청을 수행하는 api 호출 함수
 *
 * @param { object } payload 로그인 정보 - { id: stirng, password: string }
 * @returns Promise
 */
// const requestLogin = payload => $axios.post("/auth/login", payload);

// export { requestLogin };

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',  // 실제 백엔드 URL로 변경
  });
  
  export const requestLogin = (payload) => {
    return api.post('/auth/login', payload);
  };
  
