import styles from "./CartConfirmModal.module.css";
import api from "../../api";
import { useState } from "react";

function CartConfirmModal({
  userRole,
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Modal para fornecedor */}
        {userRole === "fornecedor" && (
          <>
            <h2>Conta inválida</h2>
            <p>Deve entrar com uma conta de Vendedor para Adicionar ao Carrinho.</p>
            <div className={styles.modalContent}>
              <button className={styles.btn} onClick={onClose}>
                Fechar
              </button>
            </div>
          </>
        )}

        {/* Modal de sucesso */}
        {success && userRole !== "fornecedor" && (
          <>
            <h2>Produto Adicionado ao Carrinho</h2>
            <div className={styles.modalContent}>
              <button className={styles.btn} onClick={onClose}>
                Fechar
              </button>
            </div>
          </>
        )}

        {/* Modal de compra compartilhada */}
        {!success && userRole !== "fornecedor" && quantidade < minimumOrder && (
          <>
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
          </>
        )}

        {/* Modal padrão */}
        {!success && userRole !== "fornecedor" && quantidade >= minimumOrder && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default CartConfirmModal;