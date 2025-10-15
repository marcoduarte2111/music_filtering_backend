// src/App.jsx
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./features/login/Login";
import SignUp from "./features/signup/Sign_Up";
import Home from "./pages/Home";
import SongSearch from "./features/Search_song/Search_song"; // 👈 Importa tu componente
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-title">🎵 Music Auth Portal</div>
        <nav className="nav-links">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/signup" className="nav-btn">Sign Up</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas principales */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />

          {/* Nueva ruta para búsqueda */}
          <Route path="/search" element={<SongSearch />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
