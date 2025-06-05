import { useState } from "react";
import styles from "./Cadastro.module.css";

function Cadastro() {
  const [userType, setUserType] = useState("vendedor");

  const handleSwitch = (e) => {
    setUserType(e.target.value);
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

        <form className={styles.form}>
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

          <button type="submit" className={styles.button}>
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
