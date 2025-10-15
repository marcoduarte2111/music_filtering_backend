// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./features/login/Login";
import SignUp from "./features/signup/Sign_Up";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import SongSearch from "./features/Search_song/Search_song";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <main className="app-main">
          <Routes>
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Rutas protegidas para usuarios autenticados */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SongSearch />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas solo para administradores */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
