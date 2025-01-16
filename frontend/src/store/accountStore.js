import { requestLogin } from "../common/api/accountAPI";

const state = {
  token: localStorage.getItem('authToken') || null,  // localStorage에서 초기값 가져오기
  login: !!localStorage.getItem('authToken'), // 로그인 상태 체크 (token이 있으면 로그인 상태로 간주)
};

const getters = {
  getToken: (state) => state.token,
  isLogin: (state) => state.login,
};

const mutations = {
  setToken: (state, token) => {
    state.token = token;
    state.login = true;
    localStorage.setItem('authToken', token);  // 로그인 시 로컬스토리지에 토큰 저장
  },
  removeToken: (state) => {
    state.token = null;
    state.login = false;
    localStorage.removeItem('authToken');  // 로그아웃 시 로컬스토리지에서 토큰 삭제
  },
};

const actions = {
  loginAction: async ({ commit }, loginData) => {
    try {
      const response = await requestLogin(loginData);
      commit("setToken", response.data.accessToken);  // 로그인 후 토큰 저장
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  },

  logoutAction: ({ commit }) => {
    commit("removeToken");  // 로그아웃 시 토큰 삭제
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
