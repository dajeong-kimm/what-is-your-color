import { create } from "zustand";

const useWebcamStore = create((set) => ({
  stream: null, // 웹캠 스트림 저장
  isCameraOn: false, // 카메라 ON 여부

  startCamera: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      set({ stream, isCameraOn: true });
    } catch (error) {
      console.error("카메라 접근 오류:", error);
    }
  },

  stopCamera: () => {
    set((state) => {
      if (state.stream) {
        state.stream.getTracks().forEach((track) => track.stop());
      }
      return { stream: null, isCameraOn: false };
    });
  },
}));

export default useWebcamStore;
