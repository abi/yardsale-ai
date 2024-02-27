export interface Listing {
  title: string;
  price: number;
  condition: string;
  category: string;
  description: string;
}

export enum AppState {
  LANDING_PAGE = "LANDING_PAGE",
  INITIAL = "INITIAL",
  CAMERA = "CAMERA",
  PRODUCT_DESCRIPTION = "PRODUCT_DESCRIPTION",
  PROCESSING = "PROCESSING",
  RESULT = "RESULT",
}

// Keep in sync with backend
export interface UserResponse {
  email: string;
  first_name: string;
  last_name: string;
  // subscriber_tier: string;
  stripe_customer_id: string;
}
