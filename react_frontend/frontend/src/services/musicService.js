import axios from "axios";

// 🌐 URL base del backend
const API_URL = "http://127.0.0.1:8000/api/v1/music";

// 🧠 Función auxiliar para obtener encabezados con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No se encontró token en localStorage. Es posible que el usuario no haya iniciado sesión.");
  }

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

// --- 🔍 BUSCAR CANCIÓN (POST /search) ---
export const searchMusic = async (query, limit = 5) => {
  try {
    console.log(`🎵 Buscando música para: "${query}"`);

    const body = { query, limit };
    const headers = getAuthHeaders();

    const response = await axios.post(`${API_URL}/search`, body, headers);

    console.log("✅ Resultados del backend:", response.data);
    return response.data; // ejemplo: { songs: [...], total: n }
  } catch (error) {
    console.error("❌ Error al buscar música:", error.response?.data || error.message);

    // Si el backend dice que no hay credenciales válidas
    if (error.response?.status === 401) {
      throw { detail: "No autorizado. Inicia sesión nuevamente." };
    }

    throw (
      error.response?.data || {
        detail: "No se pudo completar la búsqueda de canciones",
      }
    );
  }
};

// --- 🎧 OBTENER URL DE STREAM ---
export const getStreamUrl = async (songId) => {
  try {
    console.log(`🎶 Solicitando stream para la canción ID: ${songId}`);
    const response = await axios.get(`${API_URL}/stream/${songId}`, getAuthHeaders());
    return response.data; // { youtube_url, audio_url }
  } catch (error) {
    console.error("❌ Error al obtener stream:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error al obtener stream" };
  }
};

// --- 📜 OBTENER LETRA DE CANCIÓN ---
export const getLyrics = async (songId) => {
  try {
    console.log(`📜 Obteniendo letra para la canción ID: ${songId}`);
    const response = await axios.get(`${API_URL}/lyrics/${songId}`, getAuthHeaders());
    return response.data; // { lyrics, source }
  } catch (error) {
    console.error("❌ Error al obtener letra:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error al obtener letra" };
  }
};

// --- 🌍 TRADUCIR LETRA ---
export const translateLyrics = async (songTitle, languageCode) => {
  try {
    console.log(`🌍 Traduciendo letra de "${songTitle}" a "${languageCode}"`);
    const response = await axios.get(`${API_URL}/translate`, {
      params: { title: songTitle, lang: languageCode },
      ...getAuthHeaders(),
    });
    return response.data; // { translatedLyrics: "..." }
  } catch (error) {
    console.error("❌ Error al traducir letra:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error al traducir letra" };
  }
};

// --- 🔥 OBTENER TENDENCIAS ---
export const getTrendingSongs = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/trending`, {
      params: { limit },
      ...getAuthHeaders(),
    });
    return response.data; // { songs: [...], total, language }
  } catch (error) {
    console.error("❌ Error al obtener tendencias:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error al obtener canciones populares" };
  }
};
