import style from "./WalletModal.module.css";
import { useNavigate } from "react-router-dom";

const WalletModal = ({ carteira }) => {
  const navigate = useNavigate();
  return (
    <div className={style.modal}>
      <h2>Minha Carteira</h2>
      {carteira ? (
        <div className={style.walletInfo}>
          <p>
            <strong>Saldo:</strong> R${carteira.saldo}
          </p>
          <button className={style.btn} onClick={() => navigate("/payment")}>
            Adicionar Saldo
          </button>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default WalletModal;
