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
      .get(`/vendedor/pedidos/${pedidoId}`)
      .then((res) => {
        const { pedido, compras } = res.data;

        const pedidoFormatado = {
          ...pedido,
          itens: compras.map((compra) => ({
            produto: {
              nome: compra.produto?.nome || `Produto #${compra.id_produto}`,
              descricao: compra.produto?.descricao || "",
              imagem: compra.produto?.imagem?.dados || null,
              tipoImagem: compra.produto?.imagem?.tipo || null,
              avaliacao: compra.produto?.avaliacao_media || 0
            },
            preco_unidade: compra.preco_unidade,
            quantidade: compra.quantidade,
            frete_pago: compra.frete_pago || 0
          }))
        };

        setPedido(pedidoFormatado);
      })
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

  const totalProdutos = pedido.itens?.reduce(
    (sum, i) => sum + i.preco_unidade * i.quantidade,
    0
  ) || 0;

  const totalFrete = pedido.itens?.reduce(
    (sum, i) => sum + (i.frete_pago || 0),
    0
  ) || 0;

  const taxa = totalProdutos * 0.02;

  const totalFinal = totalProdutos + totalFrete + taxa - (pedido.desconto || 0);

  const orderData = {
    id: pedido.id_pedido,
    orderDate: pedido.dataCadastro,
    payment: pedido.metodo_pagamento,
    status: pedido.estado,
    address: {
      street: pedido.rua || "",
      number: pedido.numero || "",
      complement: pedido.complemento || "",
      cep: pedido.cep || "",
      phone: pedido.telefone || ""
    },
    items:
      pedido.itens?.map((item) => ({
        title: item.produto?.nome || "",
        brand: item.produto?.descricao || "",
        price: `R$${Number(item.preco_unidade).toFixed(2)}`,
        qty: item.quantidade,
        image: item.produto?.imagem,
        imageType: item.produto?.tipoImagem,
        rating: item.produto?.avaliacao
      })) || [],
    summary: {
      price: `R$${totalProdutos.toFixed(2)}`,
      discount: pedido.desconto
        ? `- R$${Number(pedido.desconto).toFixed(2)}`
        : "- R$0.00",
      delivery: `+ R$${totalFrete.toFixed(2)}`,
      tax: `+ R$${taxa.toFixed(2)}`,
      total: `R$${totalFinal.toFixed(2)}`
    }
  };

  const steps = [
    { label: "Pedido Confirmado", icon: "check_circle" },
    { label: "Enviado", icon: "inventory_2" },
    { label: "Saiu para entrega", icon: "local_shipping" },
    { label: "Entregue", icon: "home" }
  ];

  const statusMap = {
    CARRINHO: "Pedido Confirmado",
    CONFIRMADO: "Pedido Confirmado",
    PROCESSANDO: "Enviado",
    ENVIADO: "Enviado",
    ENTREGA: "Saiu para entrega",
    ENTREGUE: "Entregue"
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

        <div className={styles.items}>
          {orderData.items.map((item, i) => (
            <OrderItem key={i} {...item} />
          ))}
        </div>

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
              {orderData.address.street}, {orderData.address.number}
              <br />
              {orderData.address.complement && (
                <>
                  {orderData.address.complement}
                  <br />
                </>
              )}
              CEP: {orderData.address.cep}
              <br />
              {orderData.address.phone || "Telefone não informado"}
            </p>
          </div>
        </div>

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
          <p className={styles.total}>
            <span>Total</span>
            <span>{orderData.summary.total}</span>
          </p>
        </div>

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

const OrderItem = ({ title, brand, price, qty, image, imageType, rating }) => (
  <div className={styles.item}>
    <div className={styles.itemLeft}>
      {image && (
        <img
          src={`data:${imageType};base64,${image}`}
          alt={title}
          className={styles.itemImage}
        />
      )}
      <div className={styles.itemInfo}>
        <p className={styles.itemTitle}>{title}</p>
        <p className={styles.itemBrand}>{brand}</p>
        {rating > 0 && (
          <div className={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`material-icons ${i < rating ? styles.filled : ""}`}
              >
                star
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
    <div className={styles.itemPrice}>
      <p>{price}</p>
      <p>Qtd: {qty}</p>
    </div>
  </div>
);

export default OrderTracking;
