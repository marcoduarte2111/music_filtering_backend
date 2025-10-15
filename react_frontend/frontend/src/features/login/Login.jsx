import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importar useNavigate
import { loginUser, loginWithSpotify } from "../../services/authService";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 👈 Hook para redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log("Usuario autenticado:", data);

      // ✅ Redirigir a /home después del login exitoso
      navigate("/home");
    } catch (err) {
      setError(err.detail || "Error al iniciar sesión");
    }
  };

  const handleSpotifyLogin = () => {
    loginWithSpotify();
  };

  const goToSignUp = () => {
    navigate("/signup"); // 👈 Redirección a SignUp con React Router
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión en Music Auth Portal</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
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
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Iniciar sesión
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button onClick={handleSpotifyLogin} className="spotify-btn">
          🎵 Iniciar sesión con Spotify
        </button>

        <p className="register-text">
          ¿No tienes cuenta?{" "}
          <button className="link-button" onClick={goToSignUp}>
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
