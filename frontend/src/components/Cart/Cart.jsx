import Header from '../Header/Header';

import style from './Cart.module.css';

function Cart() {
  return (
    <>
      <Header />
      <div className={style.cart}>
        <h1>Carrinho</h1>
        <p>Seu carrinho está vazio.</p>
      </div>
    </>
  );
}

export default Cart;
