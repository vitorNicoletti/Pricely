
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Cart.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Cart = () => {

  const navigate = useNavigate();

  // Dados simulados do carrinho
  const cartItems = [
    {
      id: 1,
      title: 'Coca-cola Engradado vidro 350ml',
      brand: 'Coca-cola 350ml',
      price: 7.00,
      qty: 2,
    },
    {
      id: 2,
      title: 'Boneco do Lucas Neto 2',
      brand: 'Toy LTDA',
      price: 150.00,
      qty: 1,
    },
    {
      id: 3,
      title: 'Brinquedo do Lucas Neto',
      brand: 'Toy LTDA',
      price: 50.00,
      qty: 1,
    }
    
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 0.1 * subtotal;
  const total = subtotal - discount;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Seu Carrinho</h1>

        <div className={styles.items}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemBrand}>{item.brand}</p>
              </div>
              <div className={styles.itemPrice}>
                <p>R${item.price.toFixed(2)}</p>
                <p>Qtd: {item.qty}</p>
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
