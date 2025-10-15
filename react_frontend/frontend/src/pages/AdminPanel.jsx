import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSongs: 0,
    totalPlaylists: 0
  });

  useEffect(() => {
    // Aquí puedes hacer llamadas a la API para obtener estadísticas
    // Por ahora usamos datos de ejemplo
    setStats({
      totalUsers: 150,
      totalSongs: 2500,
      totalPlaylists: 320
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-logo">
          <h1>🎵 Admin Panel</h1>
        </div>
        <div className="admin-user-info">
          <span>👤 {user?.full_name || user?.email}</span>
          <span className="admin-badge">ADMIN</span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="welcome-section">
          <h2>Bienvenido, {user?.full_name || "Administrador"}</h2>
          <p>Panel de control y gestión del sistema</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Usuarios</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎵</div>
            <div className="stat-info">
              <h3>Canciones</h3>
              <p className="stat-number">{stats.totalSongs}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Playlists</h3>
              <p className="stat-number">{stats.totalPlaylists}</p>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <h3>Acciones Rápidas</h3>
          <div className="action-buttons">
            <button className="action-btn">
              ➕ Agregar Canción
            </button>
            <button className="action-btn">
              👥 Gestionar Usuarios
            </button>
            <button className="action-btn">
              📊 Ver Reportes
            </button>
            <button className="action-btn">
              ⚙️ Configuración
            </button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <span>Nuevo usuario registrado: juan@example.com</span>
              <span className="activity-time">Hace 5 min</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🎵</span>
              <span>Canción agregada: "Shape of You"</span>
              <span className="activity-time">Hace 15 min</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <span>Playlist creada: "Rock Clásico"</span>
              <span className="activity-time">Hace 1 hora</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;