import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import api from "../../api";

import styles from "./Cart.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  // Extrai todas as compras de todos os pedidos em estado CARRINHO
  const cartItems = useMemo(() => {
    const allCompras = [];
    cartData.forEach((pedidoData) => {
      if (pedidoData.pedido?.estado === "CARRINHO" && pedidoData.compras) {
        allCompras.push(...pedidoData.compras);
      }
    });
    return allCompras;
  }, [cartData]);

  // Calcula os valores quando cartItems mudar
  const { subtotal, discount, total } = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, discount: 0, total: 0 };
    }

    let subtotal = 0;
    let discount = 0;

    cartItems.forEach((item) => {
      const preco = item.preco_unidade;
      const qtd = item.quantidade;
      const promocoes = item.produto.promocoes || [];

      subtotal += preco * qtd;

      // Ordena promoções da maior para a menor quantidade para pegar a mais vantajosa
      const promocoesValidas = promocoes
        .filter((promo) => qtd >= promo.quantidade)
        .sort((a, b) => b.quantidade - a.quantidade);

      if (promocoesValidas.length > 0) {
        const melhorPromo = promocoesValidas[0];
        const descontoProduto =
          (melhorPromo.desc_porcentagem / 100) * (preco * qtd);
        discount += descontoProduto;
      }
    });

    const total = subtotal - discount;

    return { subtotal, discount, total };
  }, [cartItems]);

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Busca os itens do carrinho do Usuario
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

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Seu Carrinho</h1>

        <div className={styles.items}>
          {!cartItems || cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <h2>Seu carrinho está vazio</h2>

              <button
                className={styles.keepBuying}
                onClick={() => navigate("/")}
              >
                Ver Produtos
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id_compra} className={styles.item}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemTitle}>{item.produto.nome}</p>
                  <p className={styles.itemBrand}>{item.produto.descricao}</p>
                </div>
                <div className={styles.itemPrice}>
                  <p>R${item.preco_unidade.toFixed(2)}</p>
                  <p>Qtd: {item.quantidade}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <>
            <div className={styles.summary}>
              <h3>Resumo</h3>
              <p>
                <span>Subtotal</span>
                <span>R${subtotal.toFixed(2)}</span>
              </p>
              <p>
                <span>Desconto</span>
                <span>- R${discount.toFixed(2)}</span>
              </p>
              <p className={styles.total}>
                <span>Total</span>
                <span>R${total.toFixed(2)}</span>
              </p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.checkout}
                onClick={() => navigate("/payment")}
              >
                Finalizar Compra
              </button>
              <button
                className={styles.keepBuying}
                onClick={() => navigate("/")}
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Cart;
