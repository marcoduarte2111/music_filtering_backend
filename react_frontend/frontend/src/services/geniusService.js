// src/services/geniusService.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/genius";

// --- Obtener letra de una canción ---
// songTitle: título de la canción (por ejemplo, "Bohemian Rhapsody")
// artistName: nombre del artista (por ejemplo, "Queen")

export const getSongLyrics = async (songTitle, artistName) => {
  try {
    console.log(`🎶 Buscando letra de: ${songTitle} - ${artistName}`);

    const response = await axios.get(`${API_URL}/lyrics`, {
      params: { title: songTitle, artist: artistName },
    });

    console.log("✅ Letra recibida:", response.data);
    return response.data; // debe devolver { lyrics: "..." }
  } catch (error) {
    console.error("❌ Error al obtener letra desde Genius:", error);
    throw (
      error.response?.data ||
      { detail: "No se pudo obtener la letra de la canción" }
    );
  }
};
