import Header from "../Header/Header";
import styles from "./SellerProfile.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { useState, useEffect } from "react";
import api from "../../api";

export default function SellerProfile() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("produtos");

  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  let fornecedor = {
    id: 1,
    nomeFantasia: "Fornecedor Exemplo",
    avaliacao: 4.5,
    data_cadastro: "2025-01-10 09:15:00", // Data de cadastro no formato ISO 8601
    imagem: {
      dados:
        "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",
      tipo: "image/jpeg",
    },
  };

  function getTempoDesdeCadastro(dataCadastroStr) {
    const dataCadastro = new Date(dataCadastroStr);
    const agora = new Date();

    const diffEmMs = agora - dataCadastro;
    const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));

    const anos = Math.floor(diffEmDias / 365);
    const meses = Math.floor((diffEmDias % 365) / 30);

    if (anos > 0) {
      return `Há ${anos} ano${anos > 1 ? "s" : ""} no Pricely`;
    } else if (meses > 0) {
      return `Há ${meses} mês${meses > 1 ? "es" : ""} no Pricely`;
    } else {
      return `Há ${diffEmDias} dia${diffEmDias > 1 ? "s" : ""} no Pricely`;
    }
  }

  return (
    <>
      <Header />
      <div className={styles.backgroundImage}></div>
      <div className={styles.profilePage}>
        <div className={styles.profileCardContainer}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              {fornecedor.imagem?.dados && fornecedor.imagem?.tipo && (
                <img
                  src={`data:${fornecedor.imagem.tipo};base64,${fornecedor.imagem.dados}`}
                  alt={`Imagem de ${fornecedor.nomeFantasia}`}
                  className={styles.avatar}
                />
              )}
              <div className={styles.iconBubble}>
                <i className="fa-regular fa-comment-dots"></i>
              </div>
            </div>
            <h2>{fornecedor.nomeFantasia}</h2>
            <p className={styles.categoria}>Bebidas</p>
            <p className={styles.localizacao}>
              <i className="fa-solid fa-location-dot"></i> Curitiba, PR
            </p>
            <div className={styles.infos}>
              <span>
                <strong>{fornecedor.avaliacao}★</strong>
                <br />
                Avaliação
              </span>
              <span>
                <strong>37K</strong>
                <br />
                Vendas
              </span>
            </div>
            <p className={styles.since}>
              {getTempoDesdeCadastro(fornecedor.data_cadastro)}
              <br />
              Selo de verificado
            </p>
            <button className={styles.btn}>Seguir</button>
          </div>
        </div>
        <div className={styles.productsContainer}>
          <div className={styles.sectionTitle}>
            <button
              className={selected === "produtos" ? styles.selected : ""}
              onClick={() => setSelected("produtos")}
            >
              Produtos
            </button>
            <button
              className={selected === "sobre" ? styles.selected : ""}
              onClick={() => setSelected("sobre")}
            >
              Sobre
            </button>
          </div>
          {selected === "produtos" && (
            <div className={styles.productsList}>
              {products.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id_produto || product.id || product._id}
                    product={product}
                  />
                ))
              )}
            </div>
          )}
          {selected === "sobre" && (
            <div className={styles.sobreSection}>
              <h3>Sobre o fornecedor</h3>
              <p>
                {fornecedor.nomeFantasia}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
