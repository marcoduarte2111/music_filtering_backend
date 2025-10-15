// src/services/spotifyService.js

let api;

export const setApi = (instance) => {
  api = instance;
};

// --- BUSCAR CANCIÓN EN SPOTIFY ---
export const searchSpotifyTrack = async (query) => {
  try {
    const response = await api.get(`/v1/spotify/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al buscar canción en Spotify:", error);
    throw error.response?.data || { detail: "No se pudo buscar la canción" };
  }
};

// --- OBTENER INFORMACIÓN DE UN ARTISTA ---
export const getArtistInfo = async (artistId) => {
  try {
    const response = await api.get(`/v1/spotify/artist/${artistId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener información del artista:", error);
    throw error.response?.data || { detail: "No se pudo obtener información del artista" };
  }
};

// --- OBTENER INFORMACIÓN DE UN ÁLBUM ---
export const getAlbumInfo = async (albumId) => {
  try {
    const response = await api.get(`/v1/spotify/album/${albumId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener información del álbum:", error);
    throw error.response?.data || { detail: "No se pudo obtener la información del álbum" };
  }
};

// --- RECOMENDACIONES DESDE SPOTIFY ---
export const getSpotifyRecommendations = async (trackId) => {
  try {
    const response = await api.get(`/v1/spotify/recommendations`, {
      params: { track_id: trackId },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener recomendaciones de Spotify:", error);
    throw error.response?.data || { detail: "No se pudieron obtener las recomendaciones" };
  }
};

// --- AUTENTICAR SPOTIFY (SI SE REQUIERE TOKEN) ---
export const connectSpotify = async (authCode) => {
  try {
    const response = await api.post(`/v1/spotify/connect`, { code: authCode });
    return response.data;
  } catch (error) {
    console.error("❌ Error al conectar con Spotify:", error);
    throw error.response?.data || { detail: "Error al autenticar con Spotify" };
  }
};
