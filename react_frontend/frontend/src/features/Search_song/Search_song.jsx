import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Search_song.css";

const SongSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el query de la URL
  const queryParam = new URLSearchParams(location.search).get("query") || "";

  // Estados
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Efecto: cuando cambia el query en la URL, vuelve a buscar
  useEffect(() => {
    if (!queryParam) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");
      setResults([]);

      try {
        // 🔍 Llamada directa al backend sin usar base de datos
        const res = await axios.get(
          `http://127.0.0.1:8000/search_song/${encodeURIComponent(queryParam)}`
        );

        // Si el backend devuelve un objeto único
        if (res.data) {
          setResults([res.data]);
        } else {
          setErrorMsg("No se encontraron resultados.");
        }
      } catch (error) {
        console.error("❌ Error al buscar música:", error);
        setErrorMsg("Ocurrió un error al buscar la canción.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParam]);

  // Manejador del envío del formulario
  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      alert("Por favor, ingresa el nombre de una canción o artista.");
      return;
    }

    // Actualiza la URL → dispara el useEffect automáticamente
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="search-results-container">
      <h2>Buscador de canciones 🎵</h2>

      {/* 🔍 Barra de búsqueda */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar canción o artista..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      {/* 🔄 Estado de carga */}
      {loading && <p>Buscando canciones...</p>}

      {/* ⚠️ Mensaje de error */}
      {!loading && errorMsg && <p className="error-msg">{errorMsg}</p>}

      {/* 🎧 Resultados */}
      {!loading && results.length > 0 && (
        <ul className="results-list">
          {results.map((song) => (
            <li key={song.spotify_id || song.youtube_id || song.id} className="song-item">
              {song.thumbnail_url && (
                <img
                  src={song.thumbnail_url}
                  alt={song.title}
                  className="song-thumb"
                />
              )}
              <div>
                <strong>{song.title}</strong> - {song.artist}
                {song.duration && (
                  <p className="song-duration">
                    {(song.duration / 1000 / 60).toFixed(2)} min
                  </p>
                )}
              </div>

              {/* Si hay video de YouTube */}
              {song.youtube_id && (
                <iframe
                  width="300"
                  height="180"
                  src={`https://www.youtube.com/embed/${song.youtube_id}`}
                  title={song.title}
                  allowFullScreen
                  className="song-video"
                ></iframe>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SongSearch;
