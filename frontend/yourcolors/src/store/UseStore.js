import { create } from "zustand";
import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const useStore = create((set) => {
  const store = {
    // ✅ userPersonalId(유저 퍼스널 ID 저장) 상태 추가 (set으로만 관리)
    userPersonalId: 1,
    setUserPersonalId: (id) => set({ userPersonalId: id }),

    // ✅ userImageFile(유저 사진 저장) 상태 추가 (set으로만 관리)
    userImageFile: null,
    setUserImageFile: (image) => set({ userImageFile: image }),

    // ✅ AI 진단 결과 상태 추가
    Results: [], // 퍼스널 컬러 진단 결과 (results 배열)
    gptSummary: "", // ChatGPT 요약 결과

    setResults: (data) => set({ Results: data }), // AI 진단 결과 저장
    setGptSummary: (summary) => set({ gptSummary: summary }), // GPT 요약 저장

    // QR 이미지 상태 추가
    qrImage: null,
    setQrImage: (qrImage) => set({ qrImage }),

    // 3. 퍼스널 컬러 상세 정보 조회
    personalColorDetails: {}, // 퍼스널 컬러 상세 정보를 저장할 객체
    setPersonalColorDetails: (data) => set({ personalColorDetails: data }), // 퍼스널 컬러 상세 정보 상태 업데이트

    // 새로운 API 호출: 퍼스널 컬러 상세 정보 조회
    fetchPersonalColorDetails: async (personalId) => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/info/${personalId}`);
        console.log("3. 퍼스널 컬러 상세 정보 조회", response.data);
        set({ personalColorDetails: response.data });
      } catch (error) {
        console.error("3. 퍼스널 컬러 상세 정보 조회 오류 발생", error);
      }
    },

    // 4. 전체 퍼스널 컬러 이름 및 태그 정보 조회 API
    personalColors: [], // 퍼스널 컬러 데이터를 저장할 배열
    setPersonalColors: (data) => set({ personalColors: data }), // 데이터를 상태에 저장하는 함수

    fetchPersonalColors: async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/info/tag-list`);
        console.log("4. 전체 퍼스널 컬러 이름 및 태그 정보 조회 API", response.data.personal_colors);
        set({ personalColors: response.data.personal_colors }); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error("4. 전체 퍼스널 컬러 이름 및 태그 정보 조회 API 오류 발생", error);
      }
    },

    // 5. 특정 퍼스널컬러의 화장품 목록 조회 API
    cosmetics: { lip: [], eye: [], cheek: [] }, // 초기값
    loading: false,

    fetchCosmetics: async (personalId) => {
      set({ loading: true });
      try {
        const response = await axios.get(`${apiBaseUrl}/api/info/cosmetic/${personalId}`);
        const responsemans = await axios.get(`${apiBaseUrl}/api/info/mans/${personalId}`);
        console.log("5. 특정 퍼스널컬러의 화장품 목록 조회 API", response.data);
        set({
          cosmetics: {
            lip: response.data.lip_products || [],
            eye: response.data.eye_products || [],
            cheek: response.data.cheek_products || [],
            mans: responsemans.data.mans_products || [],
          },
          loading: false,
        });
      } catch (error) {
        console.error("5. 특정 퍼스널컬러의 화장품 목록 조회 API 오류 발생:", error);
        set({ loading: false });
      }
    },

    // 6. 화장품 컬러 상세 조회 API
    productDetails: {}, // 화장품 상세 정보 상태
    fetchProductDetails: async (productID, category) => {
      try {
        let url = "";
        if (category === "mans") {
          // mans 카테고리일 때
          url = `${apiBaseUrl}/api/info/mans/product/${productID}`;
        } else {
          // lip, eye, cheek일 때
          url = `${apiBaseUrl}/api/info/cosmetic/product/${productID}`;
        }
        const response = await axios.get(url);
        console.log("6. 화장품 컬러 상세 조회 API", response.data);

        // 데이터 저장
        set({ productDetails: response.data });
      } catch (error) {
        console.error("6. 화장품 컬러 상세 조회 API 오류 발생", error);
      }
    },
  };

  return store;
});

// 🔹 상태를 window 객체에 등록 (개발용)
if (typeof window !== "undefined") {
  window.store = useStore;
  console.log("✅ Zustand 상태가 window.store에 저장되었습니다.");
}

export default useStore;
