export const IS_HOSTED = import.meta.env.VITE_IS_HOSTED === "true";

export const USE_TEST_PRODUCTS =
  import.meta.env.VITE_USE_TEST_PRODUCTS === "true";

export const WS_BACKEND_URL =
  import.meta.env.VITE_WS_BACKEND_URL || "ws://127.0.0.1:7002";

export const HTTP_BACKEND_URL =
  import.meta.env.VITE_HTTP_BACKEND_URL || "http://127.0.0.1:7002";

// Clerk on hosted version
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
