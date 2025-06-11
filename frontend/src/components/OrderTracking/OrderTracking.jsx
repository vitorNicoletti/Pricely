import api from "../../api";
import styles from "./OrderTracking.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderTracking = () => {
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchCart = async () => {
      try {
        const response = await api.get("/vendedor/carrinho");
        setCartData(response.data);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
      }
    };
    fetchCart();
  }, [navigate]);

  if (!cartData) {
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

  // Se o estado da compra for CARRINHO, não mostra nada
  // if (cartData.carrinho?.estado === "CARRINHO") {
  //   return null;
  // }

  // Mapeia os dados do backend para o formato esperado
  const orderData = {
    id: cartData.carrinho.id_pedido,
    orderDate: cartData.carrinho.dataCadastro,
    payment: cartData.carrinho.metodo_pagamento,
    status: cartData.compras?.[0]?.estado || "",
    address: {
      street: cartData.carrinho.rua || "",
      city: cartData.carrinho.cep || "",
      phone: "",
    },
    items:
      cartData.compras?.map((item) => ({
        title: item.produto?.nome || "",
        brand: item.produto?.descricao || "",
        price: `R$${Number(item.preco_unidade).toFixed(2)}`,
        qty: item.quantidade,
      })) || [],
    summary: {
      price: `R$${cartData.compras
        ?.reduce((sum, i) => sum + i.preco_unidade * i.quantidade, 0)
        .toFixed(2)}`,
      discount: cartData.carrinho.desconto
        ? `- R$${Number(cartData.carrinho.desconto).toFixed(2)}`
        : "- R$0.00",
      delivery: "R$0.00",
      tax: "+R$0.00",
      sharedSave: "-R$0.00",
      total: `R$${cartData.compras
        ?.reduce((sum, i) => sum + i.preco_unidade * i.quantidade, 0)
        .toFixed(2)}`,
    },
  };

  // Atualiza steps e status conforme estado da compra
  const steps = [
    { label: "Pedido Confirmado", icon: "check_circle" },
    { label: "Enviado", icon: "inventory_2" },
    { label: "Saiu para entrega", icon: "local_shipping" },
    { label: "Entregue", icon: "home" },
  ];
  const statusMap = {
    CONFIRMADO: "Pedido Confirmado",
    ENVIADO: "Enviado",
    ENTREGUE: "Entregue",
    ENTREGA: "Saiu para entrega",
  };
  const currentStatus = statusMap[orderData.status] || "Pedido Confirmado";
  const currentStepIndex = steps.findIndex(
    (step) => step.label === currentStatus
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Cabeçalho do pedido */}
        <div className={styles.header}>
          <div>
            <h1>ID do pedido: {orderData.id}</h1>
            <p>
              Data do pedido:{" "}
              <strong>
                {new Date(orderData.orderDate).toLocaleDateString()}
              </strong>
            </p>
            {/* <p className={styles.deliveryEstimate}>
              Estimativa de chegada:{" "}
              {new Date(orderData.deliveryEstimate).toLocaleDateString()}
            </p> */}
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

        {/* Pagamento e Entrega */}
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
              {orderData.address.city}
              <br />
              {orderData.address.phone}
            </p>
          </div>
        </div>

        {/* Resumo do pedido */}
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
