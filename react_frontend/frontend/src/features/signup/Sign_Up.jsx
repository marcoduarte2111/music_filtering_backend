import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginWithSpotify, registerUser } from "../../services/authService";
import "./Sign_Up.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
      // Register the user
      const data = await registerUser(name, email, password, preferredLanguage);
      console.log("✅ Usuario registrado correctamente:", data);

      // Auto-login after successful registration
      const userData = await login(email, password);
      console.log("✅ Login automático exitoso:", userData);

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("⚠️ Error:", err);
      setError(err.detail || err.message || "Error al registrar el usuario");
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
          ¿Ya tienes cuenta?{" "}
          <button className="link-button" onClick={() => navigate("/login")}>
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
