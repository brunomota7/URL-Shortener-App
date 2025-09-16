// api.ts
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// intercepta requisições para adicionar token do cookie
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// intercepta respostas para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sessão expirada. Faça login novamente.");
      Cookies.remove("token");
    }
    return Promise.reject(error);
  }
);

export default api;