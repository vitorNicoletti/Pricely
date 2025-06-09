import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import styles from "./Cadastro.module.css";

function Cadastro() {
  const navigate = useNavigate();

  // 1) Estados para controlar todos os inputs
  const [userType, setUserType] = useState("vendedor");

  // Campos comuns a ambos
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Campos específicos de vendedor
  const [cpfCnpj, setCpfCnpj] = useState("");

  // Campos específicos de fornecedor
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [repNome, setRepNome] = useState("");
  const [repCpf, setRepCpf] = useState("");
  const [repTelefone, setRepTelefone] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSwitch = (e) => {
    setUserType(e.target.value);

    // Limpar todos os campos ao trocar a opção
    setEmail("");
    setSenha("");
    setCpfCnpj("");
    setRazaoSocial("");
    setNomeFantasia("");
    setCnpj("");
    setInscricaoEstadual("");
    setInscricaoMunicipal("");
    setLogradouro("");
    setNumero("");
    setComplemento("");
    setRepNome("");
    setRepCpf("");
    setRepTelefone("");
  };

  // 2) Função que envia o POST ao backend, variando a URL e payload conforme userType
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (userType === "vendedor") {
      // Monta payload de vendedor
      const payload = { email, senha, cpfCnpj };
      try {
        const response = await api.post("/cadastro/vendedor", payload);
        setSuccess(
          response.data.mensagem || "Vendedor cadastrado com sucesso!"
        );
        setEmail("");
        setSenha("");
        setCpfCnpj("");
        // Realiza login automático após cadastro
        let login_data = { email, senha };
        try {
          const loginResponse = await api.post("/login", login_data);
          const data = loginResponse.data;
          localStorage.setItem("authToken", data.token);
          setError("");
          navigate("/");
        } catch (loginErr) {
          setError("Conta criada, mas erro ao fazer login automático.");
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setError(
            err.response.data.erro ||
              err.response.data.message ||
              "Erro ao cadastrar vendedor."
          );
        } else {
          setError("Erro de conexão. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Monta payload de fornecedor
      const payload = {
        email,
        senha,
        razaoSocial,
        nomeFantasia,
        cnpj,
        inscricaoEstadual,
        inscricaoMunicipal,
        logradouro,
        numero,
        complemento,
        repNome,
        repCpf,
        repTelefone,
      };
      try {
        const response = await api.post("/cadastro/fornecedor", payload);
        setSuccess(
          response.data.mensagem || "Fornecedor cadastrado com sucesso!"
        );
        setEmail("");
        setSenha("");
        setRazaoSocial("");
        setNomeFantasia("");
        setCnpj("");
        setInscricaoEstadual("");
        setInscricaoMunicipal("");
        setLogradouro("");
        setNumero("");
        setComplemento("");
        setRepNome("");
        setRepCpf("");
        setRepTelefone("");
        // Realiza login automático após cadastro
        let login_data = { email, senha };
        try {
          const loginResponse = await api.post("/login", login_data);
          const data = loginResponse.data;
          localStorage.setItem("authToken", data.token);
          setError("");
          navigate("/");
        } catch (loginErr) {
          setError("Conta criada, mas erro ao fazer login automático.");
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setError(
            err.response.data.erro ||
              err.response.data.message ||
              "Erro ao cadastrar fornecedor."
          );
        } else {
          setError("Erro de conexão. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p>
            Bem-vindo ao <span className={styles.brand}>Pricely</span>
          </p>
          <p>
            Já possui uma conta? <span className={styles.link}><a href="./login">Entrar</a></span>
          </p>
        </div>

        <h1 className={styles.title}>Criar Conta</h1>

        <div className={styles.switchContainer}>
          <label>
            <input
              type="radio"
              value="vendedor"
              checked={userType === "vendedor"}
              onChange={handleSwitch}
            />
            Vendedor
          </label>
          <label>
            <input
              type="radio"
              value="fornecedor"
              checked={userType === "fornecedor"}
              onChange={handleSwitch}
            />
            Fornecedor
          </label>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          {/* CAMPOS COMUNS */}
          <label className={styles.label}>
            Digite seu nome de usuário ou email
            <input
              type="text"
              placeholder="Usuário ou email"
              className={styles.input}
            />
          </label>

          <div className={styles.doubleInput}>
            <label className={styles.label}>
              Nome
              <input
                type="text"
                placeholder="Nome Completo"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Número de telefone
              <input
                type="text"
                placeholder="Número de telefone"
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.label}>
            Digite sua senha
            <input
              type="password"
              placeholder="Senha"
              className={styles.input}
            />
          </label>

          {/* Campo extra para vendedor */}
          {userType === "vendedor" && (
            <label className={styles.label}>
              CPF ou CNPJ
              <input
                type="text"
                placeholder="CPF ou CNPJ"
                className={styles.input}
              />
            </label>
          )}

          {/* Campos extras para fornecedor */}
          {userType === "fornecedor" && (
            <>
              <label className={styles.label}>
                Razão Social
                <input type="text" placeholder="Razão Social" className={styles.input} />
              </label>
              <label className={styles.label}>
                Nome Fantasia
                <input type="text" placeholder="Nome Fantasia" className={styles.input} />
              </label>
              <label className={styles.label}>
                CNPJ
                <input type="text" placeholder="CNPJ" className={styles.input} />
              </label>
              <label className={styles.label}>
                Inscrição Estadual
                <input type="text" placeholder="Inscrição Estadual" className={styles.input} />
              </label>
              <label className={styles.label}>
                Inscrição Municipal
                <input type="text" placeholder="Inscrição Municipal" className={styles.input} />
              </label>
              <div className={styles.doubleInput}>
                <label className={styles.label}>
                  Logradouro
                  <input type="text" placeholder="Logradouro" className={styles.input} />
                </label>
                <label className={styles.label}>
                  Número
                  <input type="text" placeholder="Número" className={styles.input} />
                </label>
              </div>
              <label className={styles.label}>
                Complemento
                <input type="text" placeholder="Complemento" className={styles.input} />
              </label>
              <label className={styles.label}>
                Nome do Representante
                <input type="text" placeholder="Nome do Representante" className={styles.input} />
              </label>
              <label className={styles.label}>
                CPF do Representante
                <input type="text" placeholder="CPF do Representante" className={styles.input} />
              </label>
              <label className={styles.label}>
                Telefone do Representante
                <input type="text" placeholder="Telefone do Representante" className={styles.input} />
              </label>
            </>
          )}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Enviando..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
