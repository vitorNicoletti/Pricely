import { useState } from 'react';
import './Login.css';
import googleLogo from '../../assets/google.svg';
import facebookLogo from '../../assets/facebook.png';
import appleLogo from '../../assets/apple.svg';

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
    <div className="login-container">
      <div className="login-left" />
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <span>Bem-vindo ao <span className="highlight">Pricely</span></span>
            <div className="signup-link">
              <span>Não possui conta?</span>
              <a href="./Signup">Criar conta</a>
            </div>
          </div>

          <h1>Entrar</h1>

          {error && <div className="error-message">{error}</div>}

          <label>Digite seu nome de Usuário ou Email</label>
          <input
            type="text"
            placeholder="Nome de Usuário ou email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          
          <label>Digite sua Senha</label>
          <div className="password-input">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot-password">
            <a href="#">Esqueci minha senha</a>
          </div>
          
          <button className="login-btn" onClick={handleLogin}>Entrar</button>
          
          <div className="divider">OU</div>

          <div className="social-buttons">
            <button className="icon-btn"><img src={googleLogo} alt="Google" /></button>
            <button className="icon-btn"><img src={facebookLogo} alt="Facebook" /></button>
            <button className="icon-btn"><img src={appleLogo} alt="Apple" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
