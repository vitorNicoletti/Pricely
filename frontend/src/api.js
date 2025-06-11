import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

// Interceptor para adicionar o token em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para deslogar o usuário se o token for inválido ou expirado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se a resposta for 401 (Não Autorizado) ou 403 (Proibido)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn("Token expirado ou inválido. Deslogando usuário...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      handleLogout();
    }
    return Promise.reject(error);
  }
);

const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};
export default api;
