import styles from "./OrderTracking.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api"; 

const OrderTracking = () => {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pedidoId) return;

    api
      .get(`/vendedor/pedido/${pedidoId}`)
      .then((res) => setPedido(res.data))
      .catch((err) => {
        console.error("Erro ao buscar pedido:", err);
        setError("Não foi possível carregar o pedido.");
      });
  }, [pedidoId]);

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!pedido) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <p>Carregando pedido #{pedidoId}...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Cálculo do total e estrutura de dados
  const total = pedido.itens?.reduce(
    (sum, i) => sum + i.preco_unidade * i.quantidade,
    0
  ) || 0;

  const orderData = {
    id: pedido.id_pedido,
    orderDate: pedido.dataCadastro,
    payment: pedido.metodo_pagamento,
    status: pedido.estado,
    address: {
      street: pedido.rua || "",
      cep: pedido.cep || "",
      phone: pedido.telefone || "", // se disponível
    },
    items: pedido.itens?.map((item) => ({
      title: item.produto?.nome || "",
      brand: item.produto?.descricao || "",
      price: `R$${Number(item.preco_unidade).toFixed(2)}`,
      qty: item.quantidade,
    })) || [],
    summary: {
      price: `R$${total.toFixed(2)}`,
      discount: pedido.desconto
        ? `- R$${Number(pedido.desconto).toFixed(2)}`
        : "- R$0.00",
      delivery: "R$0.00",
      tax: "+R$0.00",
      sharedSave: "-R$0.00",
      total: `R$${total.toFixed(2)}`,
    },
  };

  const steps = [
    { label: "Pedido Confirmado", icon: "check_circle" },
    { label: "Enviado", icon: "inventory_2" },
    { label: "Saiu para entrega", icon: "local_shipping" },
    { label: "Entregue", icon: "home" },
  ];

  const statusMap = {
    CONFIRMADO: "Pedido Confirmado",
    ENVIADO: "Enviado",
    ENTREGA: "Saiu para entrega",
    ENTREGUE: "Entregue",
  };

  const currentStatus = statusMap[orderData.status] || "Pedido Confirmado";
  const currentStepIndex = Math.max(
    steps.findIndex((step) => step.label === currentStatus),
    0
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Cabeçalho */}
        <div className={styles.header}>
          <div>
            <h1>ID do pedido: {orderData.id}</h1>
            <p>
              Data do pedido:{" "}
              <strong>
                {new Date(orderData.orderDate).toLocaleDateString()}
              </strong>
            </p>
          </div>
          <button className={styles.trackButton}>Track order</button>
        </div>

        {/* Etapas do pedido */}
        <div className={styles.steps}>
          {steps.map((step, i) => {
            let stepClass = styles.step;
            if (i < currentStepIndex) stepClass = styles.stepCompleted;
            else if (i === currentStepIndex) stepClass = styles.stepActive;

            return (
              <div key={i} className={stepClass}>
                <span className={`material-icons ${styles.icon}`}>
                  {step.icon}
                </span>
                <div>{step.label}</div>
              </div>
            );
          })}
        </div>

        {/* Itens do pedido */}
        <div className={styles.items}>
          {orderData.items.map((item, i) => (
            <OrderItem key={i} {...item} />
          ))}
        </div>

        {/* Informações de pagamento e entrega */}
        <div className={styles.grid}>
          <div>
            <h3>Pagamento</h3>
            <p>{orderData.payment}</p>
          </div>
          <div>
            <h3>Entrega</h3>
            <p>
              Endereço
              <br />
              {orderData.address.street}
              <br />
              CEP: {orderData.address.cep}
              <br />
              {orderData.address.phone || "Telefone não informado"}
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className={styles.summary}>
          <h3>Resumo do pedido</h3>
          <p>
            <span>Preço</span>
            <span>{orderData.summary.price}</span>
          </p>
          <p>
            <span>Desconto</span>
            <span>{orderData.summary.discount}</span>
          </p>
          <p>
            <span>Delivery</span>
            <span>{orderData.summary.delivery}</span>
          </p>
          <p>
            <span>Taxa</span>
            <span>{orderData.summary.tax}</span>
          </p>
          <p className={styles.green}>
            <span>Economia por rachar</span>
            <span>{orderData.summary.sharedSave}</span>
          </p>
          <p className={styles.total}>
            <span>Total</span>
            <span>{orderData.summary.total}</span>
          </p>
        </div>

        {/* Ajuda */}
        <div className={styles.help}>
          <h3>Precisa de ajuda?</h3>
          <ul>
            <li>
              <a href="#">Problemas na entrega</a>
            </li>
            <li>
              <a href="#">Informações de entrega</a>
            </li>
            <li>
              <a href="#">Devolver</a>
            </li>
          </ul>
        </div>

        <Footer />
      </div>
    </>
  );
};

// Componente para exibir item individual
const OrderItem = ({ title, brand, price, qty }) => (
  <div className={styles.item}>
    <div className={styles.itemInfo}>
      <p className={styles.itemTitle}>{title}</p>
      <p className={styles.itemBrand}>{brand}</p>
    </div>
    <div className={styles.itemPrice}>
      <p>{price}</p>
      <p>Qtd: {qty}</p>
    </div>
  </div>
);

export default OrderTracking;
