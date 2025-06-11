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
    const login_data = { email: usernameOrEmail, senha: password };

    setLoading(true);
    try {
      // 1) Autentica e recebe { token, perfil }
      const { data } = await api.post("/login", login_data);
      const { token } = data;

      // 2) Armazena token
      localStorage.setItem("authToken", token);

      try {
        // Tenta buscar como vendedor
        const userResponse = await api.get("/vendedor/me");
        userResponse.data.role = "vendedor"; // Adiciona a role para identificar o tipo de usuário
        localStorage.setItem("user", JSON.stringify(userResponse.data));
      } catch (vendedorErr) {
        try {
          // Se falhar, tenta buscar como fornecedor
          const userResponse = await api.get("/fornecedor/me");
          userResponse.data.role = "fornecedor"; // Adiciona a role para identificar o tipo de usuário
          localStorage.setItem("user", JSON.stringify(userResponse.data));
        } catch (fornecedorErr) {
          console.error("Erro ao buscar dados do usuário:", fornecedorErr);
        }
      }

      setError("");
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.erro ||
        err.response?.data?.message ||
        err.message ||
        "Erro de conexão.";
      setError(msg);
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

          <label>Nome de Usuário ou Email</label>
          <input
            type="text"
            placeholder="Nome de Usuário ou email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />

          <label>Senha</label>
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
