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

// Define the initial state outside of the create function
const initialState: Omit<
  StoreState,
  | "next"
  | "cancel"
  | "goToLandingPage"
  | "setDescriptionFormat"
  | "setDescriptionAudio"
  | "setDescriptionText"
  | "addImage"
  | "addProcessingLogs"
  | "setListing"
> = {
  // App state
  appState: AppState.INITIAL,

  // Description of the product
  descriptionFormat: "audio",
  descriptionAudio: null,
  descriptionText: "",

  // Images of the product
  imageDataUrls: [],

  // Processing logs
  processingLogs: "",

  // Generated Listing
  listing: null,
};

export const useStore = create<StoreState>((set) => ({
  ...initialState,

  // App state
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

      // Reset the state if we're getting out of the initial state
      if (state.appState === AppState.INITIAL) {
        set({
          ...initialState,
        });
      }

      return { appState: nextStateMap[state.appState] };
    }),
  cancel: () => set({ appState: AppState.INITIAL }),

  // Description of the product
  setDescriptionFormat: (format) => set({ descriptionFormat: format }),
  setDescriptionAudio: (url) => set({ descriptionAudio: url }),
  setDescriptionText: (text) => set({ descriptionText: text }),

  // Images of the product
  addImage: (url) =>
    set((state) => ({ imageDataUrls: [...state.imageDataUrls, url] })),

  // Processing logs
  addProcessingLogs: (logs) =>
    set((state) => ({ processingLogs: state.processingLogs + logs })),

  // Generated Listing
  setListing: (listing) => set({ listing }),
}));
