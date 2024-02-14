import { create } from "zustand";

interface AudioStoreState {
  audioDataUrl: string | null;
  setAudioDataUrl: (url: string | null) => void;
}

export const useStore = create<AudioStoreState>((set) => ({
  audioDataUrl: null,
  setAudioDataUrl: (url) => set({ audioDataUrl: url }),
}));
