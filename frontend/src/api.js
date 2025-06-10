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

// Interceptor para lidar com respostas de erro
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
      handleLogout(); // Esta função precisa ser definida ou importada
    }
    return Promise.reject(error);
  }
);

// Função de logout (pode ser definida em um contexto ou utilitário)
const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user"); // Se você também armazena o perfil
  window.location.href = "/login"; // Redirecionar para a página de login
};

export default api;
