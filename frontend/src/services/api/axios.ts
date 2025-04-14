import axios from "axios";

export const BASE_URL = import.meta.env.VITE_URL_BASE_API;

export const authErrorEvent = new EventTarget();
export const AUTH_ERROR_EVENT = "authError";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, data: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(data);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se receber 401, não for a requisição de refresh e ainda não foi tentado o retry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      if (isRefreshing) {
        // Já existe um refresh em andamento: coloca a requisição na fila e aguarda o resultado
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // Tenta renovar o cookie com o refresh endpoint
        api
          .post("/auth/refresh")
          .then((response) => {
            // Aqui, como os cookies são gerenciados automaticamente pelo browser,
            // não é necessário atualizar headers manualmente.
            processQueue(null, response.data);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            authErrorEvent.dispatchEvent(
              new CustomEvent(AUTH_ERROR_EVENT, {
                detail: "Sua sessão expirou. Por favor, faça login novamente.",
              })
            );
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);
