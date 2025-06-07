// frontend/src/components/Cadastro/Cadastro.jsx

import { useState } from "react";
import styles from "./Cadastro.module.css";

function Cadastro() {
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

    if (userType === "vendedor") {
      // Monta payload de vendedor
      const payload = { email, senha, cpfCnpj };

      try {
        const response = await fetch(
          "http://localhost:3000/api/cadastro/vendedor",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();

        if (response.ok) {
          alert(data.mensagem || "Vendedor cadastrado com sucesso!");
          // Limpa os campos
          setEmail("");
          setSenha("");
          setCpfCnpj("");
        } else {
          alert(data.erro || "Erro ao cadastrar vendedor.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro de conexão. Tente novamente mais tarde.");
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
        const response = await fetch(
          "http://localhost:3000/api/cadastro/fornecedor",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();

        if (response.ok) {
          alert(data.mensagem || "Fornecedor cadastrado com sucesso!");
          // Limpa todos os campos de fornecedor
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
        } else {
          alert(data.erro || "Erro ao cadastrar fornecedor.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro de conexão. Tente novamente mais tarde.");
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
            Já possui uma conta?{" "}
            <span className={styles.link}>
              <a href="./login">Entrar</a>
            </span>
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
          {/* CAMPOS COMUNS */}
          <label className={styles.label}>
            E-mail
            <input
              type="email"
              placeholder="email@exemplo.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Senha
            <input
              type="password"
              placeholder="Senha"
              className={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>

          {/* CAMPOS EXCLUSIVOS: VENDEDOR */}
          {userType === "vendedor" && (
            <label className={styles.label}>
              CPF ou CNPJ
              <input
                type="text"
                placeholder="CPF ou CNPJ"
                className={styles.input}
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                required
              />
            </label>
          )}

          {/* CAMPOS EXCLUSIVOS: FORNECEDOR */}
          {userType === "fornecedor" && (
            <>
              <label className={styles.label}>
                Razão Social
                <input
                  type="text"
                  placeholder="Razão Social"
                  className={styles.input}
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                Nome Fantasia
                <input
                  type="text"
                  placeholder="Nome Fantasia"
                  className={styles.input}
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                CNPJ
                <input
                  type="text"
                  placeholder="CNPJ"
                  className={styles.input}
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                Inscrição Estadual
                <input
                  type="text"
                  placeholder="Inscrição Estadual"
                  className={styles.input}
                  value={inscricaoEstadual}
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                Inscrição Municipal
                <input
                  type="text"
                  placeholder="Inscrição Municipal"
                  className={styles.input}
                  value={inscricaoMunicipal}
                  onChange={(e) => setInscricaoMunicipal(e.target.value)}
                />
              </label>

              <div className={styles.doubleInput}>
                <label className={styles.label}>
                  Logradouro
                  <input
                    type="text"
                    placeholder="Logradouro"
                    className={styles.input}
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    required
                  />
                </label>
                <label className={styles.label}>
                  Número
                  <input
                    type="text"
                    placeholder="Número"
                    className={styles.input}
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label className={styles.label}>
                Complemento
                <input
                  type="text"
                  placeholder="Complemento"
                  className={styles.input}
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                Nome do Representante
                <input
                  type="text"
                  placeholder="Nome do Representante"
                  className={styles.input}
                  value={repNome}
                  onChange={(e) => setRepNome(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                CPF do Representante
                <input
                  type="text"
                  placeholder="CPF do Representante"
                  className={styles.input}
                  value={repCpf}
                  onChange={(e) => setRepCpf(e.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                Telefone do Representante
                <input
                  type="text"
                  placeholder="Telefone do Representante"
                  className={styles.input}
                  value={repTelefone}
                  onChange={(e) => setRepTelefone(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          <button type="submit" className={styles.button}>
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;