import { useState } from "react";
import { loginWithSpotify } from "../../services/authService";
import "./Sign_Up.css";

const SignUp = ({ onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          full_name: name,
          preferred_language: preferredLanguage,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Error backend:", data);
        throw new Error(data.detail || "Error al registrar usuario");
      }

      console.log("✅ Usuario registrado correctamente:", data);

      if (onRegisterSuccess) onRegisterSuccess(data);

    } catch (err) {
      console.error("⚠️ Error:", err);
      setError(err.message || "Error al registrar el usuario");
    }
  };

  const handleSpotifyLogin = () => {
    loginWithSpotify();
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Crear cuenta en Music Auth Portal</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="input-group">
            <label>Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Idioma preferido</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              required
            >
              <option value="en">Inglés</option>
              <option value="es">Español</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
            </select>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Registrarse
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button onClick={handleSpotifyLogin} className="spotify-btn">
          🎵 Registrarse con Spotify
        </button>

        <p className="login-text">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
