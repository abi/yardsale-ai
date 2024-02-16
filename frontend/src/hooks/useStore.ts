import { create } from "zustand";
import { Listing } from "../types";

type ProductDescriptionFormat = "text" | "audio";

interface StoreState {
  // Description of the product
  descriptionFormat: ProductDescriptionFormat;
  setDescriptionFormat: (format: ProductDescriptionFormat) => void;
  descriptionAudio: string | null;
  setDescriptionAudio: (url: string | null) => void;
  descriptionText: string;
  setDescriptionText: (text: string) => void;

  // Images of the product
  imageDataUrls: string[];
  setImageDataUrls: (urls: string[]) => void;

  // Generated Listing
  listing: Listing | null;
  setListing: (listing: Listing | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Description of the product
  descriptionFormat: "audio",
  setDescriptionFormat: (format) => set({ descriptionFormat: format }),
  descriptionAudio: null,
  setDescriptionAudio: (url) => set({ descriptionAudio: url }),
  descriptionText: "",
  setDescriptionText: (text) => set({ descriptionText: text }),

  // Images of the product
  imageDataUrls: [],
  setImageDataUrls: (urls) => set({ imageDataUrls: urls }),

  // Generated Listing
  listing: null,
  setListing: (listing) => set({ listing }),
}));
