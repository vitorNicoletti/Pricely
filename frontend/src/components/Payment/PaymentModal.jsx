import { useState, useEffect } from "react";
import mastercard from "../../assets/mastercard.svg";
import amex from "../../assets/amex.svg";
import visa from "../../assets/visa.svg";
import style from "./PaymentModal.module.css";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";

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

function PaymentModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expiry, setExpiry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressNumber, setNewAddressNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  const cardBrand = getCardBrand(cardNumber.replace(/\s+/g, ""));

  const balanceOptions = [
    { value: "200", label: "R$ 200,00" },
    { value: "500", label: "R$ 500,00" },
    { value: "1000", label: "R$ 1.000,00" },
    { value: "other", label: "OUTRO" },
  ];

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (!token) {
        onClose();
        navigate("/login");
        return;
      }

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          // Se o usuário tem endereços, seleciona o primeiro por padrão
          if (parsedUser.addresses && parsedUser.addresses.length > 0) {
            setSelectedAddress(parsedUser.addresses[0].id || "0");
          }
        } catch (error) {
          console.error("Erro ao parsear dados do usuário:", error);
        }
      }
    }
  }, [isOpen, navigate, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAmount("");
      setCustomAmount("");
      setCardNumber("");
      setCvc("");
      setExpiry("");
      setPostalCode("");
      setSelectedAddress("");
      setShowNewAddressForm(false);
      setNewAddressStreet("");
      setNewAddressNumber("");
      setErrors({});
    }
  }, [isOpen]);

  const handleAmountChange = (value) => {
    setSelectedAmount(value);
    if (value !== "other") {
      setCustomAmount("");
    }
  };

  const handleCustomAmountChange = (e) => {
    let value = e.target.value;

    // Remove caracteres que não sejam números, vírgula ou ponto
    value = value.replace(/[^\d.,]/g, "");

    // Substitui pontos por vírgulas (padrão brasileiro)
    value = value.replace(/\./g, ",");

    // Permite apenas uma vírgula
    const parts = value.split(",");
    if (parts.length > 2) {
      value = parts[0] + "," + parts.slice(1).join("");
    }

    // Limita a 2 casas decimais após a vírgula
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + "," + parts[1].substring(0, 2);
    }

    setCustomAmount(value);
  };

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

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setSelectedAddress(value);

    if (value === "new") {
      setShowNewAddressForm(true);
    } else {
      setShowNewAddressForm(false);
      setNewAddressStreet("");
      setNewAddressNumber("");
    }
  };

  const handleAddNewAddress = () => {
    if (newAddressStreet.trim() && newAddressNumber.trim()) {
      const newAddress = {
        id: Date.now().toString(),
        street: newAddressStreet.trim(),
        number: newAddressNumber.trim(),
        fullAddress: `${newAddressStreet.trim()}, ${newAddressNumber.trim()}`,
      };

      const updatedUser = {
        ...user,
        addresses: [...(user.addresses || []), newAddress],
      };

      setUser(updatedUser);
      setSelectedAddress(newAddress.id);
      setShowNewAddressForm(false);
      setNewAddressStreet("");
      setNewAddressNumber("");

      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const getSelectedAmountValue = () => {
    if (selectedAmount === "other") {
      if (!customAmount) return 0;
      // Converte o valor brasileiro (com vírgula) para número
      const numericValue = parseFloat(customAmount.replace(",", "."));
      return isNaN(numericValue) ? 0 : numericValue;
    }
    return selectedAmount ? parseFloat(selectedAmount) : 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação do valor selecionado
    const amountValue = getSelectedAmountValue();
    if (!selectedAmount) {
      newErrors.amount = "Selecione um valor";
    } else if (
      selectedAmount === "other" &&
      (!customAmount || amountValue <= 0)
    ) {
      newErrors.customAmount = "Digite um valor válido";
    }

    if (!isValidCardNumber(cardNumber))
      newErrors.cardNumber = "Número do cartão inválido (16 dígitos)";
    if (!isValidExpiry(expiry)) newErrors.expiry = "Data de validade inválida";
    if (!isValidCVC(cvc, cardBrand)) newErrors.cvc = "CVC inválido";
    if (!isValidPostalCode(postalCode))
      newErrors.postalCode = "Código postal inválido";
    if (!selectedAddress) newErrors.address = "Selecione um endereço";
    if (showNewAddressForm) {
      if (!newAddressStreet.trim())
        newErrors.newAddressStreet = "Rua é obrigatória";
      if (!newAddressNumber.trim())
        newErrors.newAddressNumber = "Número é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const finalAmount = getSelectedAmountValue();
      const body = {
        amount: finalAmount,
      };
      await api.put("/vendedor/carteira", body);
      window.location.reload();
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className={style.modal_overlay} onClick={handleOverlayClick}>
        <div className={style.modal_container}>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.modal_overlay} onClick={handleOverlayClick}>
      <div className={style.modal_container}>
        <div className={style.modal_header}>
          <h2>Adicionar Saldo</h2>
          <button
            className={style.close_button}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={style.payment_container}>
          {/* Seção de Seleção de Valor */}
          <div className={style.balance_section}>
            <h3>Selecione o valor</h3>
            <div className={style.balance_options}>
              {balanceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${style.balance_option} ${
                    selectedAmount === option.value ? style.active : ""
                  }`}
                  onClick={() => handleAmountChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {selectedAmount === "other" && (
              <div className={style.custom_amount}>
                <label>Valor personalizado</label>
                <div className={style.currency_input}>
                  {/* <span>R$</span> */}
                  <input
                    type="text"
                    placeholder="0,00"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                  />
                </div>
                {errors.customAmount && (
                  <span className={style.error}>{errors.customAmount}</span>
                )}
              </div>
            )}

            {errors.amount && (
              <span className={style.error}>{errors.amount}</span>
            )}
          </div>

          <div className={style.payment_methods}>
            <h3>Método de pagamento</h3>
            <div className={style.payment_buttons}>
              <button
                className={method === "card" ? style.active : ""}
                onClick={() => setMethod("card")}
                type="button"
              >
                💳
                <br />
                Card
              </button>
              <button
                className={method === "eps" ? style.active : null}
                onClick={() => setMethod("eps")}
                type="button"
              >
                🅿️
                <br />
                EPS
              </button>
              <button
                className={method === "giropay" ? style.active : null}
                onClick={() => setMethod("giropay")}
                type="button"
              >
                🏦
                <br />
                Giropay
              </button>
              <button type="button">⋯</button>
            </div>
          </div>

          <div className={style.card_form}>
            <label>Número do cartão</label>
            <div className={style.card_input_wrapper}>
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
              />
              <div className={style.card_icons}>
                {cardBrand === "visa" && <img src={visa} alt="Visa" />}
                {cardBrand === "mastercard" && (
                  <img src={mastercard} alt="Mastercard" />
                )}
                {cardBrand === "amex" && <img src={amex} alt="Amex" />}
              </div>
            </div>
            {errors.cardNumber && (
              <span className={style.error}>{errors.cardNumber}</span>
            )}

            <div className={style.form_row}>
              <div>
                <label>Validade</label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  maxLength={7}
                />
                {errors.expiry && (
                  <span className={style.error}>{errors.expiry}</span>
                )}
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
                {errors.cvc && (
                  <span className={style.error}>{errors.cvc}</span>
                )}
              </div>
            </div>

            <div className={style.form_row}>
              <div>
                <label>País</label>
                <select defaultValue={"brasil"}>
                  <option value="alemanha">Alemanha</option>
                  <option value="brasil">Brasil</option>
                  <option value="canada">Canadá</option>
                  <option value="china">China</option>
                  <option value="eua">Estados Unidos</option>
                  <option value="franca">França</option>
                  <option value="japao">Japão</option>
                  <option value="itelia">Itália</option>
                  <option value="india">Índia</option>
                  <option value="eu">Reino Unido</option>
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
                {errors.postalCode && (
                  <span className={style.error}>{errors.postalCode}</span>
                )}
              </div>
            </div>

            <div className={style.modal_actions}>
              <button
                type="button"
                onClick={onClose}
                className={style.cancel_button}
              >
                Cancelar
              </button>
              <button type="submit" className={style.submit_button}>
                Adicionar R${" "}
                {selectedAmount === "other" && customAmount
                  ? parseFloat(customAmount).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })
                  : selectedAmount
                  ? parseFloat(selectedAmount).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })
                  : "0,00"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
