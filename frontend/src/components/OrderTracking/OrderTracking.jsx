import React from 'react';
import styles from './OrderTracking.module.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const OrderTracking = () => {
  // Dados que vão vir do back
  const orderData = {
    id: '3354654654526',
    orderDate: '2025-02-16',
    deliveryEstimate: '2025-05-16',
    payment: 'Visa **56',
    status: 'Enviado',
    address: {
      street: '847 Jewess Bridge Apt. 174',
      city: 'London, UK',
      phone: '474-769-3919'
    },
    items: [
      { title: 'Coca-cola Engradado vidro 350ml', brand: 'Coca - cola 350ml', price: 'R$7.00', qty: 2 },
      { title: 'Boneco do Lucas Neto 2', brand: 'Toy LTDA', price: 'R$150.00', qty: 2 },
      { title: 'Brinquedo do Lucas Neto', brand: 'Toy LTDA', price: 'R$50.00', qty: 1 }
    ],
    summary: {
      price: 'R$207',
      discount: '- R$41.40',
      delivery: 'R$0.00',
      tax: '+R$21.88',
      sharedSave: '-R$17.95',
      total: 'R$169.53'
    }
  };

  const steps = [
    { label: 'Pedido Confirmado', icon: 'check_circle' },
    { label: 'Enviado', icon: 'inventory_2' },
    { label: 'Saiu para entrega', icon: 'local_shipping' },
    { label: 'Entregue', icon: 'home' }
  ];

  // index da etapa atual
  const currentStepIndex = steps.findIndex(step => step.label === orderData.status);

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Cabeçalho do pedido */}
        <div className={styles.header}>
          <div>
            <h1>ID do pedido: {orderData.id}</h1>
            <p>Data do pedido: <strong>{new Date(orderData.orderDate).toLocaleDateString()}</strong></p>
            <p className={styles.deliveryEstimate}>
              Estimativa de chegada: {new Date(orderData.deliveryEstimate).toLocaleDateString()}
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
                <span className={`material-icons ${styles.icon}`}>{step.icon}</span>
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
              Endereço<br />
              {orderData.address.street}<br />
              {orderData.address.city}<br />
              {orderData.address.phone}
            </p>
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className={styles.summary}>
          <h3>Resumo do pedido</h3>
          <p><span>Preço</span><span>{orderData.summary.price}</span></p>
          <p><span>Desconto</span><span>{orderData.summary.discount}</span></p>
          <p><span>Delivery</span><span>{orderData.summary.delivery}</span></p>
          <p><span>Taxa</span><span>{orderData.summary.tax}</span></p>
          <p className={styles.green}><span>Economia por rachar</span><span>{orderData.summary.sharedSave}</span></p>
          <p className={styles.total}><span>Total</span><span>{orderData.summary.total}</span></p>
        </div>

        {/* Ajuda */}
        <div className={styles.help}>
          <h3>Precisa de ajuda?</h3>
          <ul>
            <li><a href="#">Problemas na entrega</a></li>
            <li><a href="#">Informações de entrega</a></li>
            <li><a href="#">Devolver</a></li>
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
