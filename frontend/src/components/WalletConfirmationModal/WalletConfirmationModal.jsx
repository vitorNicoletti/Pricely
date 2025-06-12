import React from 'react';
import styles from './WalletConfirmationModal.module.css';

const WalletConfirmationModal = ({ isOpen, onClose, onConfirm, total, isLoading }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Confirmar Pagamento com Carteira</h2>
        <p>
          O valor total da sua compra é de{' '}
          <strong className={styles.totalValue}>R$ {total.toFixed(2)}</strong>.
        </p>
        <p>
          Você confirma o uso do saldo da sua carteira para finalizar este pedido?
        </p>
        <div className={styles.modalActions}>
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isLoading} 
            className={`${styles.button} ${styles.confirmButton}`}
          >
            {isLoading ? 'Processando...' : 'Sim, Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConfirmationModal;