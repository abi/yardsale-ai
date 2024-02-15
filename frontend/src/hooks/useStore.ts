import { create } from "zustand";
import { Listing } from "../types";

interface StoreState {
  audioDataUrl: string | null;
  setAudioDataUrl: (url: string | null) => void;
  imageDataUrls: string[];
  setImageDataUrls: (urls: string[]) => void;
  listing: Listing | null;
  setListing: (listing: Listing | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  audioDataUrl: null,
  setAudioDataUrl: (url) => set({ audioDataUrl: url }),
  imageDataUrls: [],
  setImageDataUrls: (urls) => set({ imageDataUrls: urls }),
  listing: null,
  setListing: (listing) => set({ listing }),
}));
