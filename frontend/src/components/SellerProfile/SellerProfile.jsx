import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import avatar_placeholder from "../../assets/profile_placeholder.png";
import Header from "../Header/Header";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./SellerProfile.module.css";
import api from "../../api";

export default function SellerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // configura timeout maior
  api.defaults.timeout = 15000;

  // Só o dono do perfil vê certas ações
  const stored = localStorage.getItem("user");
  const loggedUser = stored ? JSON.parse(stored) : null;
  const isOwner = loggedUser && String(loggedUser.id_usuario) === id;

  const [fornecedor, setFornecedor] = useState({});
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("produtos");

  // 3) Estados para edição/exclusão
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 4) Carrega perfil e produtos (só os do fornecedor)
  useEffect(() => {
    // perfil
    if (isOwner) {
      setFornecedor(loggedUser);
    } else {
      api
        .get(`/fornecedor/${id}`)
        .then((res) => setFornecedor(res.data))
        .catch((err) => console.error("Erro ao buscar fornecedor:", err));
    }

    // lista de produtos do próprio fornecedor
    api
      .get("/")
      .then((res) => {
        const meus = res.data.filter(
          (p) => String(p.id_fornecedor) === String(id)
        );
        console.log("Produtos do fornecedor:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, [id]);

  // 5) Abre modal de edição
  const openEditModal = (product) => {
    setCurrentProduct({ ...product });
    if (product.imagem?.dados && product.imagem?.tipo) {
      setEditPreview(
        `data:${product.imagem.tipo};base64,${product.imagem.dados}`
      );
    } else {
      setEditPreview(null);
    }
    setEditImage(null);
    setIsEditOpen(true);
  };

  // 6) Abre modal de exclusão
  const handleDeleteClick = (product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  // 7) Confirma exclusão
  const confirmDelete = () => {
    api
      .delete(`/produtos/${currentProduct.id_produto}`)
      .then(() => {
        setProducts((prev) =>
          prev.filter(
            (p) => String(p.id_produto) !== String(currentProduct.id_produto)
          )
        );
        setIsDeleteOpen(false);
      })
      .catch((err) => console.error("Erro ao excluir produto:", err));
  };

  // 8) Lida com troca de imagem no modal de edição
  const handleImageChangeEdit = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setEditPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // 9) Salva edição
  const handleSaveEdit = () => {
    const formData = new FormData();
    formData.append("nome", currentProduct.nome);
    formData.append("descricao", currentProduct.descricao);
    formData.append("preco_unidade", currentProduct.preco_unidade);
    formData.append("estado", currentProduct.estado);
    if (editImage) formData.append("imagem", editImage);

    api
      .put(`/produtos/${currentProduct.id_produto}`, formData)
      .then(() => {
        // atualiza lista local
        setProducts((prev) =>
          prev.map((p) =>
            String(p.id_produto) === String(currentProduct.id_produto)
              ? { ...currentProduct }
              : p
          )
        );
        setIsEditOpen(false);
      })
      .catch((err) => console.error("Erro ao salvar produto:", err));
  };

  // 10) Auxiliar: tempo desde cadastro
  function getTempoDesdeCadastro(str) {
    if (!str) return "";
    const d = new Date(str);
    if (isNaN(d)) return "";
    const dias = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    const anos = Math.floor(dias / 365);
    const meses = Math.floor((dias % 365) / 30);
    if (anos) return `Há ${anos} ano${anos > 1 ? "s" : ""}`;
    if (meses) return `Há ${meses} mês${meses > 1 ? "es" : ""}`;
    return `Há ${dias} dia${dias > 1 ? "s" : ""}`;
  }

  return (
    <>
      <Header />

      {/* Banner */}
      <div className={styles.backgroundImage}>
        <h2>
          <button className={styles.btn}>Coloque Sua Imagem AQUI!</button>
        </h2>
      </div>

      <div className={styles.profilePage}>
        {/* Cartão perfil */}
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
                  alt="Padrão"
                  className={styles.avatar}
                />
              )}
              <div className={styles.iconBubble}>
                <i className="fa-regular fa-comments" />
              </div>
            </div>
            <h2>{fornecedor.nomeFantasia || "Fornecedor"}</h2>
            <div className={styles.infos}>
              <strong>{fornecedor.avaliacao_media ?? "?"}★</strong>
              <span>Avaliação</span>
            </div>
            <p className={styles.since}>
              {getTempoDesdeCadastro(fornecedor.dataCadastro)}
            </p>

            {/* Seguir e Cadastrar */}
            <button className={styles.btn}>Seguir</button>
            {isOwner && (
              <button
                className={styles.registerButton}
                onClick={() => navigate("/produtos/novo")}
              >
                Cadastrar Produto
              </button>
            )}
          </div>
        </div>

        {/* Produtos / Sobre */}
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
                products.map((p) => (
                  <div key={p.id_produto} className={styles.productCardWrapper}>
                    <ProductCard product={p} />
                    {isOwner && (
                      <div className={styles.cardActions}>
                        <i
                          className="fa-solid fa-pen-to-square"
                          onClick={() => openEditModal(p)}
                          title="Editar"
                        />
                        <i
                          className="fa-solid fa-trash"
                          onClick={() => handleDeleteClick(p)}
                          title="Excluir"
                        />
                      </div>
                    )}
                  </div>
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

      {/* Modal de edição */}
      {isEditOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Editar Produto</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <label>
                Nome:
                <input
                  type="text"
                  value={currentProduct.nome}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      nome: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Descrição:
                <textarea
                  value={currentProduct.descricao}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      descricao: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Preço:
                <input
                  type="number"
                  step="0.01"
                  value={currentProduct.preco_unidade}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      preco_unidade: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Estado:
                <select
                  value={currentProduct.estado}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      estado: e.target.value,
                    })
                  }
                >
                  <option value="novo">Novo</option>
                  <option value="usado">Usado</option>
                </select>
              </label>
              <label className={styles.modalUploadLabel}>
                {editPreview ? (
                  <img src={editPreview} alt="Preview" />
                ) : (
                  "Clique ou arraste para alterar a imagem"
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChangeEdit}
                />
              </label>
              <div className={styles.modalButtons}>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setIsEditOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de exclusão */}
      {isDeleteOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsDeleteOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p>
              Tem certeza que deseja excluir o produto{" "}
              <strong>{currentProduct?.nome}</strong>?
            </p>
            <div className={styles.modalButtons}>
              <button onClick={confirmDelete}>Sim, Excluir</button>
              <button onClick={() => setIsDeleteOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
