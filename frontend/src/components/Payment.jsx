import { useState } from "react";
import "./Payment.css";

function getCardBrand(number) {
  if (/^4/.test(number)) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  return "default";
}

function formatCardNumber(value) {
  const digitsOnly = value.replace(/\D/g, "");
  const groups = digitsOnly.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}

function formatCVC(value, cardBrand) {
  const digitsOnly = value.replace(/\D/g, "");
  const maxLength = cardBrand === "amex" ? 4 : 3;
  return digitsOnly.slice(0, maxLength);
}

function formatExpiry(value) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
  if (digitsOnly.length === 0) return "";
  if (digitsOnly.length < 3) {
    return digitsOnly;
  }
  return digitsOnly.slice(0, 2) + " / " + digitsOnly.slice(2);
}

function formatPostalCode(value) {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length <= 5) return digitsOnly;
  return digitsOnly.slice(0, 5) + "-" + digitsOnly.slice(5, 8);
}

function isValidCardNumber(number) {
  const digits = number.replace(/\s/g, "");
  return /^\d{16}$/.test(digits);
}

function isValidExpiry(value) {
  const [month, year] = value.split(" / ");
  if (!month || !year || month.length !== 2 || year.length !== 2) return false;

  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) return false;

  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(2000 + parseInt(year, 10), monthNum - 1, 1);
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  expiryDate.setDate(0);

  return expiryDate >= currentDate;
}

function isValidCVC(cvc, brand) {
  const length = brand === "amex" ? 4 : 3;
  return new RegExp(`^\\d{${length}}$`).test(cvc);
}

function isValidPostalCode(postalCode) {
  return /^\d{5}-?\d{3}$/.test(postalCode);
}

function Payment() {
  const [paymentType, setPaymentType] = useState("solo");
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expiry, setExpiry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState({});

  const cardBrand = getCardBrand(cardNumber.replace(/\s+/g, ""));

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleCvcChange = (e) => {
    const formatted = formatCVC(e.target.value, cardBrand);
    setCvc(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const handlePostalCodeChange = (e) => {
    const formatted = formatPostalCode(e.target.value);
    setPostalCode(formatted);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isValidCardNumber(cardNumber)) newErrors.cardNumber = "Número do cartão inválido (16 dígitos)";
    if (!isValidExpiry(expiry)) newErrors.expiry = "Data de validade inválida";
    if (!isValidCVC(cvc, cardBrand)) newErrors.cvc = "CVC inválido";
    if (!isValidPostalCode(postalCode)) newErrors.postalCode = "Código postal inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Pagamento enviado com sucesso!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-container">
      <div className="payment-mode">
        <button
          className={paymentType === "solo" ? "active" : ""}
          onClick={() => setPaymentType("solo")}
          type="button"
        >
          <span role="img" aria-label="user">👤</span> Pagar sozinho
        </button>
        <button
          className={paymentType === "group" ? "active" : ""}
          onClick={() => setPaymentType("group")}
          type="button"
        >
          <span role="img" aria-label="group">👥</span> Pagar em grupo
        </button>
      </div>

      <div className="payment-methods">
        <button
          className={method === "card" ? "active" : ""}
          onClick={() => setMethod("card")}
          type="button"
        >
          💳<br />Card
        </button>
        <button
          className={method === "eps" ? "active" : ""}
          onClick={() => setMethod("eps")}
          type="button"
        >
          🅿️<br />EPS
        </button>
        <button
          className={method === "giropay" ? "active" : ""}
          onClick={() => setMethod("giropay")}
          type="button"
        >
          🏦<br />Giropay
        </button>
        <button type="button">⋯</button>
      </div>

      <div className="card-form">
        <label>Número do cartão</label>
        <div className="card-input-wrapper">
          <input
            type="text"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
          <div className="card-icons">
            {cardBrand === "visa" && <img src="visa.svg" alt="Visa" />}
            {cardBrand === "mastercard" && <img src="mastercard.svg" alt="Mastercard" />}
            {cardBrand === "amex" && <img src="amex.svg" alt="Amex" />}
          </div>
        </div>
        {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}

        <div className="form-row">
          <div>
            <label>Validade</label>
            <input
              type="text"
              placeholder="MM / YY"
              value={expiry}
              onChange={handleExpiryChange}
              maxLength={7}
            />
            {errors.expiry && <span className="error">{errors.expiry}</span>}
          </div>
          <div>
            <label>CVC</label>
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={handleCvcChange}
              maxLength={4}
            />
            {errors.cvc && <span className="error">{errors.cvc}</span>}
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
            <input
              type="text"
              placeholder="Código postal"
              value={postalCode}
              onChange={handlePostalCodeChange}
              maxLength={9}
            />
            {errors.postalCode && <span className="error">{errors.postalCode}</span>}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Enviar Pagamento
        </button>
      </div>
    </form>
  );
}

export default Payment;
