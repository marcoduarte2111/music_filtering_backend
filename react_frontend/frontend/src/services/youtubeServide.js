// src/services/youtubeService.js

let api;

export const setApi = (instance) => {
  api = instance;
};

// --- BUSCAR VIDEO O CANCIÓN EN YOUTUBE ---
export const searchYouTube = async (query) => {
  try {
    const response = await api.get(`/v1/youtube/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al buscar en YouTube:", error);
    throw error.response?.data || { detail: "No se pudo realizar la búsqueda" };
  }
};

// --- OBTENER URL DE STREAM / REPRODUCCIÓN ---
export const getYouTubeStream = async (videoId) => {
  try {
    const response = await api.get(`/v1/youtube/stream/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener stream de YouTube:", error);
    throw error.response?.data || { detail: "No se pudo obtener la URL de reproducción" };
  }
};

// --- OBTENER DETALLES DEL VIDEO ---
export const getVideoDetails = async (videoId) => {
  try {
    const response = await api.get(`/v1/youtube/video/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener detalles del video:", error);
    throw error.response?.data || { detail: "No se pudieron obtener los detalles del video" };
  }
};

// --- OBTENER SUBTÍTULOS DEL VIDEO (SI EXISTEN) ---
export const getVideoSubtitles = async (videoId, lang = "en") => {
  try {
    const response = await api.get(`/v1/youtube/subtitles/${videoId}`, {
      params: { lang },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener subtítulos:", error);
    throw error.response?.data || { detail: "No se pudieron obtener los subtítulos" };
  }
};
