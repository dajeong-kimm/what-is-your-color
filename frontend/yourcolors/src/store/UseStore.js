import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
  personalColors: [], // 퍼스널 컬러 데이터를 저장할 배열
  setPersonalColors: (data) => set({ personalColors: data }), // 데이터를 상태에 저장하는 함수
  
  personalColorDetails: {}, // 퍼스널 컬러 상세 정보를 저장할 객체
  setPersonalColorDetails: (data) => set({ personalColorDetails: data }), // 퍼스널 컬러 상세 정보 상태 업데이트

  fetchPersonalColors: async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/info/tag-list');
      console.log(response.data.personal_colors);
      set({ personalColors: response.data.personal_colors }); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching personal colors:', error);
    }
  },

  // 새로운 API 호출: 퍼스널 컬러 상세 정보 조회
  fetchPersonalColorDetails: async (personalId) => {
    try {
      const response = await axios.get(`http://localhost:9000/api/info/${personalId}`);
      console.log(response.data);
      
      // 데이터를 상태에 저장
      set({ personalColorDetails: response.data });
    } catch (error) {
      console.error('Error fetching personal color details:', error);
    }
  },
}));

export default useStore;
