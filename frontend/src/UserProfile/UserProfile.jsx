import React from 'react';
import styles from './UserProfile.module.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const UserProfile = () => {
  const user = {
    name: "João Silva",
    email: "joao@email.com",
    balance: 120.50,
    totalSaved: 350.75
  };

  const recentOrders = [
    { id: "PED1234", date: "02/06/2025", total: "R$ 99,90", status: "Entregue" },
    { id: "PED1233", date: "28/05/2025", total: "R$ 189,00", status: "Enviado" }
  ];

  const mostPurchasedItems = [
    { name: "Caixa de Sabão OMO", quantity: 5 },
    { name: "Arroz Tio João 5kg", quantity: 4 },
    { name: "Detergente Ypê", quantity: 10 }
  ];

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Bem-vindo, {user.name} 👋</h1>

        <section className={styles.summary}>
          <div className={styles.card}>
            <span className={`material-icons ${styles.icon}`}>account_balance_wallet</span>
            <div>
              <p>Saldo disponível</p>
              <h3>R$ {user.balance.toFixed(2)}</h3>
            </div>
          </div>
          <div className={styles.card}>
            <span className={`material-icons ${styles.icon}`}>shopping_cart</span>
            <div>
              <p>Último pedido</p>
              <h3>{recentOrders[0].total} ({recentOrders[0].status})</h3>
            </div>
          </div>
          <div className={styles.card}>
            <span className={`material-icons ${styles.icon}`}>savings</span>
            <div>
              <p>Economia acumulada</p>
              <h3>R$ {user.totalSaved.toFixed(2)}</h3>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Últimos Pedidos</h2>
          <ul className={styles.orderList}>
            {recentOrders.map(order => (
              <li key={order.id}>
                <strong>{order.id}</strong> - {order.date} - {order.total} - <span className={styles.status}>{order.status}</span>
              </li>
            ))}
          </ul>
          <button className={styles.viewAll}>Ver todos os pedidos</button>
        </section>

        <section className={styles.section}>
          <h2>Itens que você mais compra</h2>
          <ul className={styles.itemList}>
            {mostPurchasedItems.map((item, idx) => (
              <li key={idx}>
                <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.3rem' }}>shopping_cart</span>
                <strong>{item.name}</strong> — {item.quantity}x
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.shortcuts}>
          <h2>Atalhos rápidos</h2>
          <div className={styles.links}>
            <button><span className="material-icons">edit</span> Editar Perfil</button>
            <button><span className="material-icons">favorite</span> Ver Favoritos</button>
            <button><span className="material-icons">history</span> Meus Pedidos</button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
