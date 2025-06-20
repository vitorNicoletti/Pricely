import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import avatar_placeholder from "../../assets/profile_placeholder.png";
import Header from "../Header/Header";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./SellerProfile.module.css";
import api from "../../api";

export default function SellerProfile() {

  const { id }     = useParams();      // id do fornecedor visitado
  const navigate   = useNavigate();
  api.defaults.timeout = 15000;        // aumenta timeout para uploads

  // usuário logado
  const stored      = localStorage.getItem("user");
  const loggedUser  = stored ? JSON.parse(stored) : null;
  const isOwner     = loggedUser && String(loggedUser.id_usuario) === id;

  
  const [isVendor,       setIsVendor]       = useState(false);   
  const [fornecedor,     setFornecedor]     = useState({});
  const [products,       setProducts]       = useState([]);
  const [selected,       setSelected]       = useState("produtos");

  // follow
  const [isFollowing,    setIsFollowing]    = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  // modais e upload imagem
  const fileInputRef     = useRef(null);
  const [isEditOpen,     setIsEditOpen]     = useState(false);
  const [isDeleteOpen,   setIsDeleteOpen]   = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editPreview,    setEditPreview]    = useState(null);
  const [editImage,      setEditImage]      = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // 1) Verificar se usuário logado é vendedor.
    if (loggedUser && !isOwner) {
      api.get("/vendedor/me")
         .then(() => setIsVendor(true))
         .catch(() => setIsVendor(false));       
    }

    // 2) Perfil do fornecedor
    const endpoint = isOwner ? "/fornecedor/me" : `/fornecedor/${id}`;
    api.get(endpoint)
       .then(res => setFornecedor({
         ...res.data,
         nomeFantasia: res.data.nomeFantasia || res.data.nome_fantasia || ""
       }))
       .catch(err => console.error("Erro ao buscar fornecedor:", err));

    // 3) Produtos do fornecedor
    api.get(`/produtos/fornecedor/${id}`)
       .then(res => setProducts(res.data))
       .catch(err => console.error("Erro ao buscar produtos:", err));

    // 4) Sempre buscar status e total de seguidores
   api.get(`seguindo/${id}`)
      .then(res => {
        setIsFollowing(res.data.followed);
        setFollowersCount(res.data.total);
      })
      .catch(err => console.error("Erro ao consultar follow:", err));
  }, [id, isOwner]);

  /* --------------------------------------------------
     Ações – Seguir / Deixar de seguir
  --------------------------------------------------*/
  const toggleFollow = () => {
    const req = isFollowing
      ? api.delete(`/seguindo/${id}`)
      : api.post  (`/seguindo/${id}`);

    req.then(res => {
         setIsFollowing(res.data.followed);
         setFollowersCount(prev =>
           res.data.followed ? prev + 1 : prev - 1
         );
       })
       .catch(err => console.error("Erro ao (des)seguir:", err));
  };

  /* --------------------------------------------------
     Upload / alteração de imagem de perfil
  --------------------------------------------------*/
  const handleChooseProfile = () => fileInputRef.current?.click();

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // preview imediato
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      setFornecedor(prev => ({
        ...prev,
        imagem: { tipo: file.type, dados: base64Data }
      }));
    };
    reader.readAsDataURL(file);

    // upload
    const fd = new FormData();
    fd.append("imagemPerfil", file);
    try {
      await api.put("/fornecedor/me", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } catch (err) {
      console.error("Erro ao atualizar imagem de perfil:", err);
    }
  };

  /* --------------------------------------------------
     CRUD de Produto
  --------------------------------------------------*/
  const openEditModal = (p) => {
    setCurrentProduct({ ...p });
    if (p.imagem?.dados) {
      setEditPreview(`data:${p.imagem.tipo};base64,${p.imagem.dados}`);
    } else setEditPreview(null);
    setEditImage(null);
    setIsEditOpen(true);
  };

  const handleImageChangeEdit = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setEditPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    const fd = new FormData();
    fd.append("nome",          currentProduct.nome);
    fd.append("descricao",     currentProduct.descricao);
    fd.append("preco_unidade", currentProduct.preco_unidade);
    fd.append("estado",        currentProduct.estado);
    if (editImage) fd.append("imagem", editImage);

    api.put(`/produtos/${currentProduct.id_produto}`, fd)
       .then(() => {
         setProducts(prev =>
           prev.map(p =>
             String(p.id_produto) === String(currentProduct.id_produto)
               ? { ...currentProduct }
               : p
           )
         );
         setIsEditOpen(false);
       })
       .catch(err => console.error("Erro ao salvar produto:", err));
  };

  const handleDeleteClick = (p) => {
    setCurrentProduct(p);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    api.delete(`/produtos/${currentProduct.id_produto}`)
       .then(() => {
         setProducts(prev =>
           prev.filter(p =>
             String(p.id_produto) !== String(currentProduct.id_produto)
           )
         );
         setIsDeleteOpen(false);
       })
       .catch(err => console.error("Erro ao excluir produto:", err));
  };

  /* --------------------------------------------------
     Utils
  --------------------------------------------------*/
  const getTempoDesdeCadastro = (dataStr) => {
    if (!dataStr) return "";
    const diffDays = Math.floor(
      (Date.now() - new Date(dataStr).getTime()) / (1000 * 60 * 60 * 24)
    );
    const years  = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    if (years)  return `Há ${years} ano${years > 1 ? "s" : ""}`;
    if (months) return `Há ${months} mês${months > 1 ? "es" : ""}`;
    return `Há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  };


  return (
    <>
      <Header />
      <div className={styles.backgroundImage}>
        {isOwner && (
          <>
            <button className={styles.btn} onClick={handleChooseProfile}>
              Coloque Sua Imagem AQUI!
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
          </>
        )}
      </div>
      <div className={styles.profilePage}>
        <div className={styles.profileCardContainer}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              {fornecedor.imagem?.dados ? (
                <img
                  src={`data:${fornecedor.imagem.tipo};base64,${fornecedor.imagem.dados}`}
                  alt="avatar"
                  className={styles.avatar}
                />
              ) : (
                <img
                  src={avatar_placeholder}
                  alt="avatar"
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
            </div>
            <p className={styles.since}>
              {getTempoDesdeCadastro(fornecedor.dataCadastro)}
            </p>
            {!isOwner && isVendor && (
              <button
                className={`${styles.btn} ${isFollowing ? styles.following : ""}`}
                onClick={toggleFollow}
              >
                {isFollowing ? "Seguindo ✓" : "Seguir"}
              </button>
            )}
            {/* contador seguidores (todo perfil) */}
            <p>{followersCount} seguidores</p>

            {/* cadastrar produto (apenas fornecedor dono) */}
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

          {/* ---- Lista de produtos ---- */}
          {selected === "produtos" && (
            <div className={styles.productsList}>
              {products.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
              ) : (
                products.map(p => (
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

          {/* ---- Seção Sobre ---- */}
          {selected === "sobre" && (
            <div className={styles.sobreSection}>
              <h3>Sobre o fornecedor</h3>
              <p>{fornecedor.nomeFantasia}</p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Modal Editar Produto ---------- */}
      {isEditOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditOpen(false)}
        >
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2>Editar Produto</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <label>
                Nome:
                <input
                  type="text"
                  value={currentProduct.nome}
                  onChange={e =>
                    setCurrentProduct({ ...currentProduct, nome: e.target.value })
                  }
                />
              </label>

              <label>
                Descrição:
                <textarea
                  value={currentProduct.descricao}
                  onChange={e =>
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
                  onChange={e =>
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
                  onChange={e =>
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
                  <img
                    src={editPreview}
                    alt="Preview"
                    className={styles.previewImg}
                  />
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

      {/* ---------- Modal Excluir Produto ---------- */}
      {isDeleteOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsDeleteOpen(false)}
        >
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
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
