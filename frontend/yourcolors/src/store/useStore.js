import { create } from 'zustand'; // named import로 수정
import axios from 'axios';

const useStore = create((set) => ({
  personalColors: [], // 퍼스널 컬러 데이터를 저장할 배열
  setPersonalColors: (data) => set({ personalColors: data }), // 데이터를 상태에 저장하는 함수
  fetchPersonalColors: async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/info/tag-list');
        console.log(response.data.personal_colors)
        
      set({ personalColors: response.data.personal_colors }); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching personal colors:', error);
    }
  },
}));

export default useStore;
