import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import api from "../../api";

import styles from "./Cart.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

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
        const response = await api.get("/vendedor/carrinho", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
      }
    };
    fetchCart();
  }, [navigate]);

  // const subtotal = cartItems.compras.reduce(
  //   (acc, item) => acc + item.preco_unidade * item.quantidade,
  //   0
  // );
  // const discount = 0.1 * subtotal;
  // const total = subtotal - discount;
  const subtotal = 0;
  const discount = 0;
  const total = 0;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Seu Carrinho</h1>

        <div className={styles.items}>
          {cartItems.compras?.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <p className={styles.itemTitle}>{item.produto.nome}</p>
                <p className={styles.itemBrand}>{item.produto.descricao}</p>
              </div>
              <div className={styles.itemPrice}>
                <p>R${item.preco_unidade.toFixed(2)}</p>
                <p>Qtd: {item.quantidade}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h3>Resumo</h3>
          <p><span>Subtotal</span><span>R${subtotal.toFixed(2)}</span></p>
          <p><span>Desconto</span><span>- R${discount.toFixed(2)}</span></p>
          <p className={styles.total}><span>Total</span><span>R${total.toFixed(2)}</span></p>
        </div>

        <div className={styles.actions}>
          <button className={styles.checkout} onClick={() => navigate("/payment")}>Finalizar Compra</button>
          <button className={styles.keepBuying} onClick={() => navigate("/")}>Continuar comprando</button>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Cart;
