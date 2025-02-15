import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpen: false,
  message: "",
  openModal: (msg) => set({ isOpen: true, message: msg }),
  closeModal: () => set({ isOpen: false, message: "" }),
}));
