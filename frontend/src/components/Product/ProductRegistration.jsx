// src/components/Product/ProductRegistration.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import styles from "../Cadastro/Cadastro.module.css";

function ProductRegistration() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estado, setEstado] = useState("novo");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cadastrarOutro, setCadastrarOutro] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco_unidade", preco);
    formData.append("estado", estado);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      // Não especifique headers em multipart/form-data, deixe o Axios definir o boundary
      const response = await api.post("/produtos", formData);
      setSuccess("Produto cadastrado com sucesso!");

      if (cadastrarOutro) {
        // Limpa o formulário para cadastrar outro produto
        setNome("");
        setDescricao("");
        setPreco("");
        setEstado("novo");
        setImagem(null);
        setPreview(null);
      } else {
        // Redireciona de volta ao perfil do fornecedor
        const user = JSON.parse(localStorage.getItem("user"));
        navigate(`/fornecedor/${user.id_usuario}`);
      }
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p>
            <span className={styles.brand}>Pricely</span>
          </p>
          <p>
            <span className={styles.link} onClick={() => navigate(-1)}>
              Voltar
            </span>
          </p>
        </div>

        <h1 className={styles.title}>Cadastrar Produto</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}

          <label className={styles.label}>
            Nome do Produto
            <input
              type="text"
              placeholder="Nome"
              className={styles.input}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Descrição
            <textarea
              placeholder="Descrição"
              className={styles.input}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
            />
          </label>

          <label className={styles.label}>
            Preço por Unidade (R$)
            <input
              type="number"
              step="0.01"
              placeholder="Preço"
              className={styles.input}
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Estado
            <select
              className={styles.input}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            >
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
            </select>
          </label>

          <div className={styles.uploadContainer}>
            <input
              id="imagem-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="imagem-upload" className={styles.uploadLabel}>
              {preview
                ? <img src={preview} alt="Preview" className={styles.previewImg}/>
                : <><i className="fa-regular fa-image" /> Arraste ou clique para adicionar imagem</>
              }
            </label>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar Produto"}
          </button>

          {success && (
            <div style={{ marginTop: "20px" }}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={cadastrarOutro}
                  onChange={(e) => setCadastrarOutro(e.target.checked)}
                />
                Cadastrar outro produto
              </label>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProductRegistration;