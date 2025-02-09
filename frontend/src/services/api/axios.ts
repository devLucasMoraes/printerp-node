import axios from "axios";

export const BASE_URL = "http://localhost:3000/api/v1";

export const authErrorEvent = new EventTarget();
export const AUTH_ERROR_EVENT = "authError";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401 e ainda não tentou refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        // Tenta renovar o token
        await api.post("/auth/refresh");
        // Refaz a requisição original com novo token
        return api(originalRequest);
      } catch {
        authErrorEvent.dispatchEvent(
          new CustomEvent(AUTH_ERROR_EVENT, {
            detail: "Sua sessão expirou. Por favor, faça login novamente.",
          })
        );
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
