import styles from "./BuyerProfile.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import profilePlaceholder from "../../assets/profile_placeholder.png";

function BuyerProfile() {
  const { id } = useParams();
  const [buyer, setBuyer] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // 1) buscar perfil do vendedor
    api
      .get(`/vendedor/${id}`)
      .then((res) => setBuyer(res.data))
      .catch((err) => console.error("Erro ao buscar perfil:", err));

    // 2) buscar pedidos do vendedor
    api
      .get(`/vendedor/${id}/pedidos`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Erro ao buscar pedidos:", err));
  }, [id]);

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
          <button className={styles.viewAll}>Ver todos os pedidos</button>
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
            <button>
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

      <Footer />
    </>
  );
}
export default BuyerProfile;
