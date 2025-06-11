import styles from "./WalletModal.module.css";
import { useEffect, useState } from "react";
import api from "../../api";

const WalletModal = ({ onClose, carteira }) => {

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>

        <h2>Minha Carteira</h2>
        {carteira ? (
          <div className={styles.walletInfo}>
            <p><strong>Saldo:</strong> R${carteira.saldo}</p>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
