// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importa el hook
import "./Home.css";

const Home = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // 👈 Instancia para redirigir

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Redirige a /search y pasa la query como parámetro
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="logo">
          <h1>🎵 Music App</h1>
        </div>
        <div className="user-info">
          <span>👤 {user?.full_name || user?.email}</span>
          <button onClick={onLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="home-content">
        <div className="welcome-banner">
          <h2>Bienvenido, {user?.full_name || "Usuario"}</h2>
          <p>Descubre y disfruta tu música favorita</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Buscar canciones, artistas, álbumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍 Buscar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
