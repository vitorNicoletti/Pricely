import { useState } from 'react';
import styles from '../styles/Login.module.css';
import googleLogo from '../assets/google.svg';
import facebookLogo from '../assets/facebook.png';
import appleLogo from '../assets/apple.svg';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append('identifier', usernameOrEmail);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/home';
      } else {
        alert(data.message || 'Erro ao fazer login.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão.');
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
              <a href="./Signup">Criar conta</a>
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

          <button className={styles.loginBtn} onClick={handleLogin}>
            Entrar
          </button>

          <div className={styles.divider}>OU</div>

          <div className={styles.socialButtons}>
            <button className={styles.iconBtn}>
              <img src={googleLogo} alt="Google" />
            </button>
            <button className={styles.iconBtn}>
              <img src={facebookLogo} alt="Facebook" />
            </button>
            <button className={styles.iconBtn}>
              <img src={appleLogo} alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
