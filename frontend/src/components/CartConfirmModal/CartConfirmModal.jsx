import styles from "./CartConfirmModal.module.css";
import api from "../../api";
import { useState } from "react";

function CartConfirmModal({
  open,
  onClose,
  quantityRef,
  product,
  minimumOrder,
}) {
  const [success, setSuccess] = useState(false);
  const quantidade = quantityRef.current?.value || 1;

  if (!open) return null;

  async function handleCartConfirm(dividir) {
    try {
      await api.post("/carrinho", {
        id_produto: product.id_produto,
        quantidade,
        dividir: dividir ? 1 : 0,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
    }
  }

  if (success) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>Produto Adicionado ao Carrinho</h2>
          <div className={styles.modalContent}>
            <button className={styles.btn} onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quantidade < minimumOrder) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h1>
            Quantidade escolhida abaixo do Mínimo! Criando Compra compartilhada!
          </h1>
          <div className={styles.modalContent}>
            <button
              className={styles.btn}
              onClick={() => handleCartConfirm(true)}
            >
              Confirmar Compra Compartilhada
            </button>
            <button
              className={styles.btn}
              onClick={onClose}
              style={{ background: "#ccc", color: "#333" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Deseja dividir este pedido com outros compradores?</h3>
        <div className={styles.modalContent}>
          <button
            className={styles.btn}
            onClick={() => handleCartConfirm(true)}
          >
            Sim, dividir
          </button>
          <button
            className={styles.btn}
            onClick={() => handleCartConfirm(false)}
          >
            Não, quero só para mim
          </button>
          <button
            className={styles.btn}
            onClick={onClose}
            style={{ background: "#ccc", color: "#333" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartConfirmModal;
