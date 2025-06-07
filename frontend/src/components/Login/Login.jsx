import { useState } from "react";
import styles from "./Login.module.css";
import googleLogo from "../../assets/google.svg";
import facebookLogo from "../../assets/facebook.png";
import appleLogo from "../../assets/apple.svg";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    let login_data = {
      email: usernameOrEmail,
      senha: password,
    };

    setLoading(true);

    try {
      const response = await api.post("/login", login_data);
      const data = response.data;
      localStorage.setItem("authToken", data.token); // Armazena o token
      setError("");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.error || "Erro ao fazer login.");
      } else {
        setError(err.message || "Erro de conexão.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <span>
              Bem-vindo ao <span className={styles.highlight}>Pricely</span>
            </span>
            <div className={styles.signupLink}>
              <span>Não possui conta?</span>
              <a href="./cadastro">Criar conta</a>
            </div>
          </div>

          <h1>Entrar</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <label>Digite seu nome de Usuário ou Email</label>
          <input
            type="text"
            placeholder="Nome de Usuário ou email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />

          <label>Digite sua Senha</label>
          <div className={styles.passwordInput}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.forgotPassword}>
            <a href="#">Esqueci minha senha</a>
          </div>

          <button
            className={styles.loginBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.divider}>OU</div>

          <div className={styles.socialButtons}>
            <button className={styles.iconBtn} disabled={loading}>
              <img src={googleLogo} alt="Google" />
            </button>
            <button className={styles.iconBtn} disabled={loading}>
              <img src={facebookLogo} alt="Facebook" />
            </button>
            <button className={styles.iconBtn} disabled={loading}>
              <img src={appleLogo} alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
