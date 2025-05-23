import { useState } from 'react';
import styles from '../styles/Signup.module.css';
import googleLogo from '../assets/google.svg';
import facebookLogo from '../assets/facebook.png';
import appleLogo from '../assets/apple.svg';

function Signup() {
  const [accountType, setAccountType] = useState('usuario');

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [CPF, setCPF] = useState('');
  const [username, setUsername] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const formData = new FormData();
    formData.append('identifier', usernameOrEmail);
    formData.append('cpf', CPF);
    formData.append('name', username);
    formData.append('phonenumber', phonenumber);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/home';
      } else {
        alert(data.message || 'Erro ao criar conta.');
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
              <span>Já possui conta?</span>
              <a href="./Login">Entrar</a>
            </div>
          </div>
        {accountType === 'usuario' ? (
          <div className={styles.tabSelector}>
            <button
              className={accountType === 'usuario' ? styles.activeTab : ''}
              onClick={() => setAccountType('usuario')}
            >
              Usuário
            </button>
            <button
              className={accountType === 'fornecedor' ? styles.activeTab : ''}
              onClick={() => setAccountType('fornecedor')}
            >
              Fornecedor
            </button>
          </div>
        ):(
            <div className={styles.tabSelector}>
            <button
              className={accountType === 'usuario' ? styles.activeTab : ''}
              onClick={() => setAccountType('usuario')}
            >
              Usuário
            </button>
            <button
              className={accountType === 'fornecedor' ? styles.activeTab : ''}
              onClick={() => setAccountType('fornecedor')}
            >
              Fornecedor
            </button>
          </div>
        )}
          <h1>Criar conta {accountType}</h1>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {accountType === 'usuario' ? (
            <>
              <div className={styles.inputRow}>
                <div>
                  <label>Digite seu nome de Usuário ou Email</label>
                  <input
                    type="text"
                    placeholder="Nome de Usuário ou email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label>CPF</label>
                  <input
                    type="text"
                    placeholder="CPF"
                    value={CPF}
                    onChange={(e) => setCPF(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div>
                  <label>Nome</label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label>Número de telefone</label>
                  <input
                    type="text"
                    placeholder="Número de telefone"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                  />
                </div>
                </div>
                <div className={styles.inputRow}>
                <div>
                  <label>Senha</label>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label>Confirmar senha</label>
                  <input
                    type="password"
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
              </div>
            </>
          ) : (
            <>
              <div className={styles.inputRow}>
                <div>
                  <label>CNPJ</label>
                  <input type="text" placeholder="CNPJ da empresa" />
                </div>
                <div>
                  <label>Nome da Empresa</label>
                  <input type="text" placeholder="Razão Social" />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div>
                  <label>Responsável</label>
                  <input type="text" placeholder="Nome do responsável" />
                </div>
                <div>
                  <label>Email comercial</label>
                  <input type="text" placeholder="Email comercial" />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div>
                  <label>Senha</label>
                  <input type="password" placeholder="Senha" />
                </div>
                <div>
                  <label>Confirmar senha</label>
                  <input type="password" placeholder="Confirmar senha" />
                </div>
              </div>
            </>
          )}

          <button className={styles.loginBtn} onClick={handleSignup}>
            Criar
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

export default Signup;
