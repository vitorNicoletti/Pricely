import avatar_placeholder from "../../assets/profile_placeholder.png";
import Header from "../Header/Header";
import styles from "./SellerProfile.module.css";
import ProductCard from "../ProductCard/ProductCard";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import api from "../../api";

export default function SellerProfile() {
  const { id } = useParams();
  const [fornecedor, setFornecedor] = useState({});
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

    api.get(`/fornecedor/${id}`).then((response) => {
      setFornecedor(response.data);
    });
  }, []);

  function getTempoDesdeCadastro(dataCadastroStr) {
    if (!dataCadastroStr) return "";
    const dataCadastro = new Date(dataCadastroStr);
    if (isNaN(dataCadastro)) return "";

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
      <div className={styles.backgroundImage}>
        <h2>
          <button className={styles.btn}>Coloque Sua Imagem AQUI!</button>
        </h2>
      </div>
      <div className={styles.profilePage}>
        <div className={styles.profileCardContainer}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              {fornecedor.imagem?.dados && fornecedor.imagem?.tipo ? (
                <img
                  src={`data:${fornecedor.imagem.tipo};base64,${fornecedor.imagem.dados}`}
                  alt={`Imagem de ${fornecedor.nomeFantasia}`}
                  className={styles.avatar}
                />
              ) : (
                <img
                  src={avatar_placeholder}
                  alt="Imagem padrão de perfil"
                  className={styles.avatar}
                />
              )}
              <div className={styles.iconBubble}>
                <i className={`fa-regular fa-comments`}></i>
              </div>
            </div>
            <h2>{fornecedor.nome_fantasia}</h2>
            {/* <p className={styles.localizacao}>
              <i className="fa-solid fa-location-dot"></i> Curitiba, PR
            </p> */}
            <div className={styles.infos}>
              <span>
                <strong>{fornecedor.avaliacao_media}★</strong>
                <br />
                Avaliação
              </span>
              {/* <span>
                <strong>37K</strong>
                <br />
                Vendas
              </span> */}
            </div>
            <p className={styles.since}>
              {getTempoDesdeCadastro(fornecedor.dataCadastro)}
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
              <p>{fornecedor.nomeFantasia}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
