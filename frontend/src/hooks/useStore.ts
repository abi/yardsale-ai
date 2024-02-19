import { create } from "zustand";
import { AppState, Listing } from "../types";

type ProductDescriptionFormat = "text" | "audio";

interface StoreState {
  // App state
  appState: AppState;
  next: () => void;
  cancel: () => void;
  goToLandingPage: () => void;

  // Description of the product
  descriptionFormat: ProductDescriptionFormat;
  setDescriptionFormat: (format: ProductDescriptionFormat) => void;
  descriptionAudio: string | null;
  setDescriptionAudio: (url: string | null) => void;
  descriptionText: string;
  setDescriptionText: (text: string) => void;

  // Images of the product
  imageDataUrls: string[];
  addImage: (url: string) => void;
  processingLogs: string;
  addProcessingLogs: (logs: string) => void;

  // Generated Listing
  listing: Listing | null;
  setListing: (listing: Listing | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  // App state
  appState: AppState.INITIAL,
  goToLandingPage: () => set({ appState: AppState.LANDING_PAGE }),
  next: () =>
    set((state) => {
      const nextStateMap = {
        [AppState.LANDING_PAGE]: AppState.INITIAL, // TODO: Do we need this?
        [AppState.INITIAL]: AppState.CAMERA,
        [AppState.CAMERA]: AppState.PRODUCT_DESCRIPTION,
        [AppState.PRODUCT_DESCRIPTION]: AppState.PROCESSING,
        [AppState.PROCESSING]: AppState.RESULT,
        [AppState.RESULT]: AppState.RESULT, // Remain on RESULT state if it's already there
      };
      return { appState: nextStateMap[state.appState] };
    }),
  cancel: () => set({ appState: AppState.INITIAL }),

  // Description of the product
  descriptionFormat: "audio",
  setDescriptionFormat: (format) => set({ descriptionFormat: format }),
  descriptionAudio: null,
  setDescriptionAudio: (url) => set({ descriptionAudio: url }),
  descriptionText: "",
  setDescriptionText: (text) => set({ descriptionText: text }),

  // Images of the product
  imageDataUrls: [],
  addImage: (url) =>
    set((state) => ({ imageDataUrls: [...state.imageDataUrls, url] })),

  // Processing logs
  processingLogs: "",
  addProcessingLogs: (logs) =>
    set((state) => ({ processingLogs: state.processingLogs + logs })),

  // Generated Listing
  listing: null,
  setListing: (listing) => set({ listing }),
}));
