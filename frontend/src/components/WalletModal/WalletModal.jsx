import style from "./WalletModal.module.css";
import { useState } from "react";
import PaymentModal from "../Payment/PaymentModal";

const WalletModal = ({ carteira }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  return (
    <>
      <div className={style.modal}>
        <h2>Minha Carteira</h2>
        {carteira ? (
          <div className={style.walletInfo}>
            <p>
              <strong>Saldo:</strong> R${carteira.saldo}
            </p>
            <button
              className={style.btn}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Adicionar Saldo
            </button>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
        }}
      />
    </>
  );
};

export default WalletModal;
