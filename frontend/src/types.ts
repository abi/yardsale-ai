export interface Listing {
  title: string;
  price: number;
  condition: string;
  category: string;
  description: string;
}

export enum AppState {
  INITIAL = "INITIAL",
  CAMERA = "CAMERA",
  PRODUCT_DESCRIPTION = "PRODUCT_DESCRIPTION",
  PROCESSING = "PROCESSING",
  RESULT = "RESULT",
}
