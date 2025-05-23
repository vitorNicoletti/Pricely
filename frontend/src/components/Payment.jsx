import { useState } from "react";
import "./Payment.css";

function getCardBrand(number) {
  if (/^4/.test(number)) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  return "default";
}

function formatCardNumber(value) {
  // Remove tudo que não for número
  const digitsOnly = value.replace(/\D/g, "");
  // Divide em grupos de 4 caracteres
  const groups = digitsOnly.match(/.{1,4}/g);
  // Junta com espaço, ou vazio se nulo
  return groups ? groups.join(" ") : "";
}

function Payment() {
  const [paymentType, setPaymentType] = useState("solo");
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");

  const cardBrand = getCardBrand(cardNumber.replace(/\s+/g, ""));

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="payment-container">
      <div className="payment-mode">
        <button
          className={paymentType === "solo" ? "active" : ""}
          onClick={() => setPaymentType("solo")}
        >
          <span role="img" aria-label="user">👤</span> Pagar sozinho
        </button>
        <button
          className={paymentType === "group" ? "active" : ""}
          onClick={() => setPaymentType("group")}
        >
          <span role="img" aria-label="group">👥</span> Pagar em grupo
        </button>
      </div>

      <div className="payment-methods">
        <button
          className={method === "card" ? "active" : ""}
          onClick={() => setMethod("card")}
        >
          💳<br />Card
        </button>
        <button
          className={method === "eps" ? "active" : ""}
          onClick={() => setMethod("eps")}
        >
          🅿️<br />EPS
        </button>
        <button
          className={method === "giropay" ? "active" : ""}
          onClick={() => setMethod("giropay")}
        >
          🏦<br />Giropay
        </button>
        <button>⋯</button>
      </div>

      <div className="card-form">
        <label>Número do cartão</label>
        <div className="card-input-wrapper">
          <input
            type="text"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19} // 16 dígitos + 3 espaços
          />
          <div className="card-icons">
            {cardBrand === "visa" && <img src="visa.svg" alt="Visa" />}
            {cardBrand === "mastercard" && <img src="mastercard.svg" alt="Mastercard" />}
            {cardBrand === "amex" && <img src="amex.svg" alt="Amex" />}
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Validade</label>
            <input type="text" placeholder="MM / YY" />
          </div>
          <div>
            <label>CVC</label>
            <input type="text" placeholder="CVC" />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>País</label>
            <select>
              <option value="brasil">Brasil</option>
            </select>
          </div>
          <div>
            <label>Código Postal</label>
            <input type="text" placeholder="Código postal" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
