import axios from "axios";

// ===================================
// 🔧 CONFIGURACIÓN BASE DEL API
// ===================================
const API_BASE_URL = "http://127.0.0.1:8000/api"; // Base real de tu backend FastAPI

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================================
// 🔐 AUTENTICACIÓN NORMAL
// ===================================

// --- REGISTRO DE USUARIO ---
export const registerUser = async (name, email, password, preferred_language = "en") => {
  try {
    const response = await api.post("/v1/auth/register", {
      email,
      full_name: name,
      preferred_language,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error al registrar usuario" };
  }
};

// --- LOGIN NORMAL ---
export const loginUser = async (email, password) => {
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await api.post("/v1/auth/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.data.access_token) {
      // ✅ Guardar token con nombre consistente
      localStorage.setItem("token", response.data.access_token);
      console.log("🔑 Token guardado correctamente:", response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error al iniciar sesión" };
  }
};

// --- OBTENER USUARIO ACTUAL ---
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    const response = await api.get("/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener usuario actual:", error);
    throw error.response?.data || error.message;
  }
};

// --- LOGOUT ---
export const logoutUser = () => {
  localStorage.removeItem("token");
  console.log("🚪 Sesión cerrada. Token eliminado.");
};

// ===================================
// 🎵 SPOTIFY OAUTH
// ===================================
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "TU_CLIENT_ID_DE_SPOTIFY"; // <-- Reemplaza con tu client_id real
const REDIRECT_URI = "http://localhost:5173/spotify/callback"; // <-- Cambia según tu entorno
const SCOPES = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
];

// --- INICIAR LOGIN CON SPOTIFY ---
export const loginWithSpotify = () => {
  const authUrl = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES.join(" "))}`;
  window.location.href = authUrl;
};

// --- INTERCAMBIAR CÓDIGO POR TOKEN ---
export const handleSpotifyCallback = async (code) => {
  try {
    const response = await api.post("/v1/auth/spotify", { code });
    const { access_token } = response.data;

    if (access_token) {
  localStorage.setItem("spotify_token", access_token);
  console.log("🎵 Token de Spotify guardado correctamente (guardado como spotify_token):", access_token);
}

    return response.data;
  } catch (error) {
    console.error("❌ Error al autenticar con Spotify:", error);
    throw error.response?.data || { detail: "Error al autenticar con Spotify" };
  }
};
