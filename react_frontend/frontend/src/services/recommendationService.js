// src/services/recommendationService.js

let api;

export const setApi = (instance) => {
  api = instance;
};

// --- OBTENER RECOMENDACIONES GENERALES ---
export const getRecommendations = async (userId) => {
  try {
    const response = await api.get(`/v1/recommendations`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener recomendaciones:", error);
    throw error.response?.data || { detail: "Error de conexión" };
  }
};

// --- RECOMENDACIONES POR ESTADO DE ÁNIMO ---
export const getMoodRecommendations = async (mood) => {
  try {
    const response = await api.get(`/v1/recommendations/mood`, {
      params: { mood },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener recomendaciones por estado de ánimo:", error);
    throw error.response?.data || { detail: "No se pudieron obtener recomendaciones" };
  }
};

// --- RECOMENDACIONES POR ARTISTA ---
export const getArtistRecommendations = async (artistName) => {
  try {
    const response = await api.get(`/v1/recommendations/artist`, {
      params: { artist: artistName },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener recomendaciones por artista:", error);
    throw error.response?.data || { detail: "No se pudieron obtener recomendaciones del artista" };
  }
};

// --- GUARDAR RECOMENDACIONES DEL USUARIO ---
export const saveUserRecommendation = async (userId, songId) => {
  try {
    const response = await api.post(`/v1/recommendations/save`, {
      user_id: userId,
      song_id: songId,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al guardar recomendación:", error);
    throw error.response?.data || { detail: "No se pudo guardar la recomendación" };
  }
};
