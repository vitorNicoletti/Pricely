import styles from "./OrderTracking.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useEffect, useState, useCallback } from "react"; // Adicionado useCallback
import { useParams } from "react-router-dom";
import api from "../../api";

import ProductRatingModal from '../RatingModal/ProductRatingModal';

const ORDER_RATED_ITEMS_KEY = 'ratedOrderItems'; // Chave para o localStorage

const OrderTracking = () => {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);
  const [productToRate, setProductToRate] = useState(null);

  // NOVO: Estado para armazenar IDs de compra já avaliadas localmente
  const [ratedPurchases, setRatedPurchases] = useState(() => {
    try {
      const stored = localStorage.getItem(ORDER_RATED_ITEMS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to parse rated items from localStorage", e);
      return {};
    }
  });

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser?.id_usuario;

  // Função para salvar a lista de compras avaliadas no localStorage
  const saveRatedPurchases = useCallback((updatedRatedPurchases) => {
    setRatedPurchases(updatedRatedPurchases);
    localStorage.setItem(ORDER_RATED_ITEMS_KEY, JSON.stringify(updatedRatedPurchases));
  }, []);

  useEffect(() => {
    if (!pedidoId) return;

    api
      .get(`/vendedor/pedidos/${pedidoId}`)
      .then((res) => {
        const { pedido, compras } = res.data;

        const pedidoFormatado = {
          ...pedido,
          itens: compras.map((compra) => ({
            id_compra: compra.id_compra,
            // NÃO MAIS DEPENDEMOS DE ja_avaliado_por_mim do backend
            produto: {
              id_produto: compra.produto?.id_produto || null,
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
  }, [pedidoId]); // Removido 'ratedPurchases' da dependência para evitar loop infinito

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
        id: item.produto?.id_produto || null,
        id_compra: item.id_compra,
        title: item.produto?.nome || "",
        brand: item.produto?.descricao || "",
        price: `R$${Number(item.preco_unidade).toFixed(2)}`,
        qty: item.quantidade,
        image: item.produto?.imagem,
        imageType: item.produto?.tipoImagem,
        rating: item.produto?.avaliacao,
        // NOVO: 'isRated' é determinado localmente
        isRated: ratedPurchases[item.id_compra] === true // Verifica se id_compra está no objeto ratedPurchases
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
    CARRINHO: "Em espera",
    PAGO: "Pedido Confirmado",
    PROCESSANDO: "Enviado",
    ENVIADO: "Enviado",
    ENTREGA: "Saiu para entrega",
    ENTREGUE: "Entregue"
  };

  const currentStatusLabel = statusMap[orderData.status];
  const currentStepIndex = steps.findIndex((step) => step.label === currentStatusLabel);
  const isOrderDelivered = orderData.status === 'ENTREGUE';

  const handleProductRatingSubmit = async (data) => {
    const { rating, feedback } = data;
    
    if (!currentUserId) {
      alert("Você precisa estar logado para avaliar um produto.");
      setProductToRate(null);
      return;
    }

    if (productToRate && productToRate.id && productToRate.idCompra) {
      console.log(`Tentando avaliar Produto ID: ${productToRate.id}, Compra ID: ${productToRate.idCompra}, Rating: ${rating}, Texto: "${feedback}"`);
      try {
        const response = await api.post(`/avaliacao/produto`, {
          id_compra: productToRate.idCompra,
          avaliacao: rating,
          texto_avaliacao: feedback,
          id_produto: productToRate.id
        });

        if (response.status === 201) {
          // alert(`Avaliação de ${rating} estrelas para "${productToRate.name || 'o produto'}" enviada com sucesso!`);
          // NOVO: Adiciona a compra avaliada ao localStorage
          const updatedRatedPurchases = { ...ratedPurchases, [productToRate.idCompra]: true };
          saveRatedPurchases(updatedRatedPurchases);
        } else {
          alert(`Erro ao enviar avaliação: ${response.data.message || 'Erro desconhecido.'}`);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        const details = error.response?.data?.detalhes ? ` Detalhes: ${error.response.data.detalhes.join(', ')}` : '';
        console.error("Erro ao enviar avaliação:", error.response ? error.response.data : error.message);
        alert(`Erro ao enviar avaliação. Por favor, tente novamente. ${errorMessage}${details}`);
      }
      setProductToRate(null);
    } else {
      alert("Erro: Dados do produto ou da compra para avaliação incompletos.");
    }
  };

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
              if (currentStepIndex === -1) {
                stepClass = styles.step;
              } else if (i < currentStepIndex) {
                stepClass = styles.stepCompleted;
              } else if (i === currentStepIndex) {
                stepClass = styles.stepActive;
              }
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
            <OrderItem
              key={i}
              {...item}
              isDelivered={isOrderDelivered}
              isRated={item.isRated} // isRated agora vem do cálculo local
              onRateClick={() => setProductToRate({ id: item.id, name: item.title, idCompra: item.id_compra })}
            />
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

      </div>

      {productToRate && (
        <ProductRatingModal
          isOpen={!!productToRate}
          onClose={() => setProductToRate(null)}
          onSubmit={handleProductRatingSubmit}
        />
      )}

      <Footer />
    </>
  );
};

const OrderItem = ({ id, id_compra, title, brand, price, qty, image, imageType, rating, isDelivered, isRated, onRateClick }) => (
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
      {/* Condição para mostrar o botão: Entregue E NÃO Avaliado */}
      {isDelivered && !isRated ? (
        <button
          className={styles.rateProductButton}
          onClick={onRateClick}
        >
          Avaliar Produto
        </button>
      ) : isDelivered && isRated ? (
        <span className={styles.ratedText}>Avaliado!</span>
      ) : null}
    </div>
  </div>
);

export default OrderTracking;