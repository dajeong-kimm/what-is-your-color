import { create } from 'zustand';
import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const useStore = create((set) => ({

  // 3. 퍼스널 컬러 상세 정보 조회
  personalColorDetails: {}, // 퍼스널 컬러 상세 정보를 저장할 객체
  setPersonalColorDetails: (data) => set({ personalColorDetails: data }), // 퍼스널 컬러 상세 정보 상태 업데이트

    // 새로운 API 호출: 퍼스널 컬러 상세 정보 조회
    fetchPersonalColorDetails: async (personalId) => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/info/${personalId}`);
        console.log(response.data);
        
        // 데이터를 상태에 저장
        set({ personalColorDetails: response.data });
      } catch (error) {
        console.error('Error fetching personal color details:', error);
      }
    },


  // 4. 전체 퍼스널 컬러 이름 및 태그 정보 조회 API
  personalColors: [], // 퍼스널 컬러 데이터를 저장할 배열
  setPersonalColors: (data) => set({ personalColors: data }), // 데이터를 상태에 저장하는 함수
  
  fetchPersonalColors: async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/info/tag-list`);
      // console.log("오우 된다!!!!!")
      console.log(response.data.personal_colors);
      set({ personalColors: response.data.personal_colors }); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching personal colors:', error);
    }
  },

  // 5. 특정 퍼스널컬러의 화장품 목록 조회 API
  cosmetics: { lip: [], eye: [], cheek: [] }, // 초기값
  loading: false,

  fetchCosmetics: async (personalId) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${apiBaseUrl}/api/info/cosmetic/${personalId}`);
      set({
        cosmetics: {
          lip: response.data.lip_products || [],
          eye: response.data.eye_products || [],
          cheek: response.data.cheek_products || [],
        },
        loading: false,
      });
    } catch (error) {
      console.error("화장품 데이터를 불러오는 중 오류 발생:", error);
      set({ loading: false });
    }
  },

  // 6. 화장품 컬러 상세 조회 API
  productDetails: {}, // 화장품 상세 정보 상태
  fetchProductDetails: async (productID) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/info/cosmetic/product/${productID}`);
      console.log("화장품 컬러 상세 정보:", response.data);
      set({ productDetails: response.data });
    } catch (error) {
      console.error("화장품 상세 정보 불러오기 실패:", error);
    }
  },

}));

export default useStore;
