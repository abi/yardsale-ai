export const USE_TEST_PRODUCTS =
  import.meta.env.VITE_USE_TEST_PRODUCTS === "true";

export const WS_BACKEND_URL =
  import.meta.env.VITE_WS_BACKEND_URL || "ws://127.0.0.1:7002";

export const HTTP_BACKEND_URL =
  import.meta.env.VITE_HTTP_BACKEND_URL || "http://127.0.0.1:7002";
