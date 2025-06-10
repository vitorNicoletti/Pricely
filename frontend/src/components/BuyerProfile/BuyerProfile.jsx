import api from "../../api";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BuyerProfile.module.css";
import profilePlaceholder from "../../assets/profile_placeholder.png";

function BuyerProfile() {
  const [buyer, setBuyer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Nenhum token de autenticação encontrado.");
      navigate("/login");
    }
    async function fetchData() {
      try {
        // 1) Buscar perfil do vendedor
        const profileResponse = await api.get("/vendedor/me");
        setBuyer(profileResponse.data);

        // 2) Buscar pedidos do vendedor
        const ordersResponse = await api.get(
          `/vendedor/${profileResponse.data.id_usuario}/pedidos`
        );
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchData();
  }, []);

  if (!buyer) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <p>Carregando...</p>
        </div>
        <Footer />
      </>
    );
  }

  // --- Dados dinâmicos ---
  const name = buyer.email.split("@")[0];
  const balance = buyer.carteira?.saldo ?? 0;
  const lastOrder = orders[0] || null;
  const totalSaved = orders.reduce(
    (sum, o) => sum + (o.total * o.desconto) / 100,
    0
  );

  // Preenche editData ao abrir modal
  const handleOpenEdit = () => {
    setEditData({
      email: buyer.email || "",
      telefone: buyer.telefone || "",
      senha: "", // Senha não deve ser preenchida inicialmente
    });
    setEditImage(null);
    setPreviewImage(null);
    setShowEditModal(true);
    setEditError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    setEditError("");
    try {
      const formData = new FormData();
      Object.entries(editData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (editImage) {
        formData.append("imagemPerfil", editImage);
      }
      await api.put("/vendedor/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const profileResponse = await api.get("/vendedor/me");
      setBuyer(profileResponse.data);
      setShowEditModal(false);
    } catch (err) {
      // Tenta extrair mensagem de erro do backend
      if (err.response && err.response.data && err.response.data.erro) {
        setEditError(err.response.data.erro);
      } else {
        setEditError("Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <>
      <Header />

      <div className={styles.container}>
        {/* === Foto de perfil adaptada === */}
        <div className={styles.profilePicContainer}>
          {buyer.imagemPerfil?.dados && buyer.imagemPerfil?.tipo ? (
            <img
              src={`data:${buyer.imagemPerfil.tipo};base64,${buyer.imagemPerfil.dados}`}
              alt={`Avatar de ${name}`}
              className={styles.avatar}
            />
          ) : (
            <img
              src={profilePlaceholder}
              alt="Avatar padrão"
              className={styles.avatar}
            />
          )}
        </div>

        <h1>Bem-vindo, {name} 👋</h1>

        <section className={styles.summary}>
          <div className={styles.card}>
            <span className={`material-icons ${styles.icon}`}>
              account_balance_wallet
            </span>
            <div>
              <p>Saldo disponível</p>
              <h3>
                {balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
          </div>

          <div className={styles.card}>
            <span className={`material-icons ${styles.icon}`}>
              shopping_cart
            </span>
            <div>
              <p>Último pedido</p>
              {lastOrder ? (
                <h3>
                  {lastOrder.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
                  ({lastOrder.metodo_pagamento})
                </h3>
              ) : (
                <h3>—</h3>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <span className={`material-icons ${styles.icon}`}>savings</span>
            <div>
              <p>Economia acumulada</p>
              <h3>
                {totalSaved.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Últimos Pedidos</h2>
          <ul className={styles.orderList}>
            {orders.map((order) => (
              <li key={order.id_pedido}>
                <strong>{order.id_pedido}</strong> –{" "}
                {new Date(order.dataCadastro).toLocaleDateString("pt-BR")} –{" "}
                {order.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                –{" "}
                <span className={styles.status}>{order.metodo_pagamento}</span>
              </li>
            ))}
          </ul>
          <button className={styles.btn}>Ver todos os pedidos</button>
        </section>

        <section className={styles.section}>
          <h2>Itens que você mais compra</h2>
          <ul className={styles.itemList}>
            <li>Sem dados</li>
          </ul>
        </section>

        <section className={styles.shortcuts}>
          <h2>Atalhos rápidos</h2>
          <div className={styles.links}>
            <button onClick={handleOpenEdit}>
              <span className="material-icons">edit</span> Editar Perfil
            </button>
            <button>
              <span className="material-icons">favorite</span> Ver Favoritos
            </button>
            <button>
              <span className="material-icons">history</span> Meus Pedidos
            </button>
          </div>
        </section>
      </div>

      {/* Modal de edição de perfil */}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Editar Perfil</h2>
            <form
              onSubmit={handleEditSubmit}
              className={styles.editForm}
              encType="multipart/form-data"
            >
              <label>
                Foto de Perfil:
                <input
                  type="file"
                  accept="image/*"
                  name="imagemPerfil"
                  onChange={handleImageChange}
                />
              </label>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Pré-visualização"
                  className={styles.avatar}
                  style={{
                    marginBottom: 12,
                    maxWidth: 120,
                    borderRadius: "50%",
                  }}
                />
              )}
              <label>
                Email:
                <input
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  required
                  type="email"
                />
              </label>
              <label>
                Telefone:
                <input
                  name="telefone"
                  value={editData.telefone}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Confirme sua senha:
                <input
                  name="senha"
                  value={editData.senha}
                  onChange={handleEditChange}
                  type="password"
                />
              </label>
              {editError && <p className={styles.error}>{editError}</p>}
              <div className={styles.modalActions}>
                <button
                  className={styles.btn}
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={loadingEdit}
                >
                  Cancelar
                </button>
                <button
                  className={styles.btn}
                  type="submit"
                  disabled={loadingEdit}
                >
                  {loadingEdit ? "Salvando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
export default BuyerProfile;
