// src/services/Api.js
import axios from "axios";

// Configura la URL base del backend
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1", // ✅ usa el prefijo correcto del backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adjuntar token automáticamente si el usuario está logueado
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor opcional para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error);
    if (!error.response) {
      alert("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    }
    return Promise.reject(error);
  }
);

export default api;
