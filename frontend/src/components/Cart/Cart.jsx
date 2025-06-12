import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import api from "../../api";

import styles from "./Cart.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import PaymentModal from "../Payment/PaymentModal";
import SupplierExperienceModal from '../SupplierExperienceModal/SupplierExperienceModal';
import WalletConfirmationModal from "../WalletConfirmationModal/WalletConfirmationModal";

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressStreet, setNewAddressStreet] = useState("");
  const [newAddressNumber, setNewAddressNumber] = useState("");
  const [newAddressComplement, setNewAddressComplement] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEvaluateId, setSupplierToEvaluateId] = useState(null);
  const [supplierToEvaluateName, setSupplierToEvaluateName] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Extrai todas as compras de todos os pedidos em estado CARRINHO
  const cartItems = useMemo(() => {
    const allCompras = [];
    cartData.forEach((pedidoData) => {
      if (pedidoData.pedido?.estado === "CARRINHO" && pedidoData.compras) {
        allCompras.push(...pedidoData.compras);
      }
    });
    return allCompras;
  }, [cartData]);

  // MODIFICADO: Calcula os valores, agora incluindo a taxa
  const { subtotal, discount, taxa, total } = useMemo(() => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, discount: 0, taxa: 0, total: 0 };
    }

    let subtotalCalculado = 0;
    let discountCalculado = 0;

    cartItems.forEach((item) => {
      const preco = item.preco_unidade;
      const qtd = item.quantidade;
      const promocoes = item.produto.promocoes || [];

      subtotalCalculado += preco * qtd;

      const promocoesValidas = promocoes
        .filter((promo) => qtd >= promo.quantidade)
        .sort((a, b) => b.quantidade - a.quantidade);

      if (promocoesValidas.length > 0) {
        const melhorPromo = promocoesValidas[0];
        const descontoProduto =
          (melhorPromo.desc_porcentagem / 100) * (preco * qtd);
        discountCalculado += descontoProduto;
      }
    });

    // NOVO: Cálculo da taxa de 5% sobre o subtotal
    const taxaCalculada = subtotalCalculado * 0.05;

    // NOVO: O total agora inclui a taxa
    const totalCalculado = subtotalCalculado + taxaCalculada - discountCalculado;

    return {
      subtotal: subtotalCalculado,
      discount: discountCalculado,
      taxa: taxaCalculada,
      total: totalCalculado
    };
  }, [cartItems]);

  // Verifica se o saldo é suficiente (a lógica não muda)
  const saldoSuficiente = useMemo(() => {
    if (!user?.carteira?.saldo || !total) return false;
    return parseFloat(user.carteira.saldo) >= total;
  }, [user, total]);

  // MODIFICADO: A função agora é async e valida a senha antes de abrir o modal
  const handleFinalizarCompra = async () => {
    setErrors({});
    if (!saldoSuficiente) {
      setIsPaymentModalOpen(true);
      return;
    }


    //Validações de campos
    if (!selectedAddress) {
      setErrors(prev => ({ ...prev, address: "Selecione um endereço para entrega" }));
      return;
    }
    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: "Digite sua senha para confirmar a compra" }));
      return;
    }

    //Verifica a senha no backend antes de prosseguir
    setIsConfirmationModalOpen(true);
  };

  // MODIFICADO: A mensagem de erro foi generalizada
  const executePurchase = async () => {

    try {
      const selectedAddressData = user.addresses.find(
        (addr) => (addr.id || addr.index) === selectedAddress
      );

      if (!selectedAddressData) {
        setErrors({ address: "Endereço selecionado não encontrado" });
        setIsLoading(false);
        return;
      }

      const body = {
        senha: password, // A senha ainda é enviada para a transação final
        rua: selectedAddressData.street,
        numero: selectedAddressData.number,
        complemento: selectedAddressData.complement || "",
        total,
      };

      const response = await api.post("/carrinho/finalizar", body);
      const { id_vendedor, nome_vendedor } = response.data;

      setIsConfirmationModalOpen(false);
      setSupplierToEvaluateId(id_vendedor);
      setSupplierToEvaluateName(nome_vendedor);
      setIsSupplierModalOpen(true);

    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      // Mensagem de erro mais genérica, já que a senha foi validada antes
      setErrors({
        general: "Ocorreu um erro ao processar sua compra. Tente novamente.",
      });
      setIsConfirmationModalOpen(false); // Fecha o modal de confirmação em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupplierFeedbackSubmit = async ({ recommend, feedback }) => {
    try {
      await api.post(`/fornecedor/${supplierToEvaluateId}/avaliar`, {
        recommend,
        feedback,
      });
      console.log("Avaliação do fornecedor enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avaliação do fornecedor:", error);
      // Você pode exibir um erro ou apenas logar
    } finally {
      setIsSupplierModalOpen(false); // Fecha o modal
      setSupplierToEvaluateId(null);
      setSupplierToEvaluateName('');
      navigate("/"); // Redireciona após enviar (ou fechar) o modal
    }
  };

  const handleCloseSupplierModal = () => {
    setIsSupplierModalOpen(false); // Fecha o modal
    setSupplierToEvaluateId(null);
    setSupplierToEvaluateName('');
    navigate("/"); // Redireciona mesmo se o usuário fechar o modal sem avaliar
  };


  const handleAddressChange = (e) => {
    const value = e.target.value;
    setSelectedAddress(value);
    setErrors({ ...errors, address: "" }); // Limpa erro de endereço

    if (value === "new") {
      setShowNewAddressForm(true);
    } else {
      setShowNewAddressForm(false);
      setNewAddressStreet("");
      setNewAddressNumber("");
      setNewAddressComplement("");
    }
  };

  const handleAddNewAddress = () => {
    const newErrors = {};

    if (!newAddressStreet.trim()) {
      newErrors.newAddressStreet = "Rua é obrigatória";
    }
    if (!newAddressNumber.trim()) {
      newErrors.newAddressNumber = "Número é obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const newAddress = {
      id: Date.now().toString(),
      street: newAddressStreet.trim(),
      number: newAddressNumber.trim(),
      complement: newAddressComplement.trim(),
      fullAddress: `${newAddressStreet.trim()}, ${newAddressNumber.trim()}${newAddressComplement.trim() ? `, ${newAddressComplement.trim()}` : ""
        }`,
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
    setNewAddressComplement("");
    setErrors({});

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Assuming you have an API endpoint to get user details including wallet
        const response = await api.get("/vendedor/me"); // <--- REPLACE WITH YOUR ACTUAL USER PROFILE ENDPOINT
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Pega dados do usuário do localStorage e, em seguida, busca os dados mais recentes
    fetchUserData();

    // Busca os itens do carrinho do Usuario
    const fetchCart = async () => {
      try {
        const response = await api.get("/vendedor/carrinho");
        setCartData(response.data);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
      }
    };
    fetchCart();
  }, [navigate, isPaymentModalOpen]); // Adicione isPaymentModalOpen como dependência

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Seu Carrinho</h1>

        <div className={styles.items}>
          {!cartItems || cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <h2>Seu carrinho está vazio</h2>

              <button
                className={styles.keepBuying}
                onClick={() => navigate("/")}
              >
                Ver Produtos
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id_compra} className={styles.item}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemTitle}>{item.produto.nome}</p>
                  <p className={styles.itemBrand}>{item.produto.descricao}</p>
                </div>
                <div className={styles.itemPrice}>
                  <p>R${item.preco_unidade.toFixed(2)}</p>
                  <p>Qtd: {item.quantidade}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems && cartItems.length > 0 && (
          <>
            {/* MODIFICADO: JSX do resumo para incluir a taxa */}
            <div className={styles.summary}>
              <h3>Resumo</h3>
              <p>
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </p>
              {/* NOVO: Exibição da taxa */}
              <p>
                <span>Taxa de Serviço (5%)</span>
                <span className={styles.taxValue}>+ R$ {taxa.toFixed(2)}</span>
              </p>
              <p>
                <span>Desconto</span>
                <span className={styles.discountValue}>- R$ {discount.toFixed(2)}</span>
              </p>
              <p className={styles.total}>
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </p>

              {/* Informações da carteira */}
              {user?.carteira && (
                <div className={styles.walletInfo}>
                  <p>
                    <span>Saldo da Carteira</span>
                    <span>R${parseFloat(user.carteira.saldo).toFixed(2)}</span>
                  </p>
                  {!saldoSuficiente && (
                    <p className={styles.insufficientBalance}>
                      <span>Saldo Insuficiente</span>
                      <span>
                        - R$
                        {(total - parseFloat(user.carteira.saldo)).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Seção de Endereço */}
            <div className={styles.addressSection}>
              <h3>Endereço de Entrega</h3>
              <div className={styles.addressSelection}>
                <select
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  className={styles.card_form}
                >
                  <option value="">Selecione um endereço</option>
                  {user?.addresses &&
                    user.addresses.map((address, index) => (
                      <option
                        key={address.id || index}
                        value={address.id || index}
                      >
                        {address.fullAddress ||
                          `${address.street}, ${address.number}`}
                      </option>
                    ))}
                  <option value="new">+ Adicionar novo endereço</option>
                </select>
                {errors.address && (
                  <span className={styles.error}>{errors.address}</span>
                )}
              </div>

              {showNewAddressForm && (
                <div className={styles.newAddressForm}>
                  <div className={styles.addressInputs}>
                    <div className={styles.inputGroup}>
                      <label>Rua</label>
                      <input
                        type="text"
                        placeholder="Nome da rua"
                        value={newAddressStreet}
                        onChange={(e) => setNewAddressStreet(e.target.value)}
                        className={errors.newAddressStreet ? styles.error : ""}
                      />
                      {errors.newAddressStreet && (
                        <span className={styles.error}>
                          {errors.newAddressStreet}
                        </span>
                      )}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Número</label>
                      <input
                        type="text"
                        placeholder="Número"
                        value={newAddressNumber}
                        onChange={(e) => setNewAddressNumber(e.target.value)}
                        className={errors.newAddressNumber ? styles.error : ""}
                      />
                      {errors.newAddressNumber && (
                        <span className={styles.error}>
                          {errors.newAddressNumber}
                        </span>
                      )}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Complemento (opcional)</label>
                      <input
                        type="text"
                        placeholder="Apto, bloco, etc."
                        value={newAddressComplement}
                        onChange={(e) =>
                          setNewAddressComplement(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className={styles.submit_button}
                    disabled={
                      !newAddressStreet.trim() || !newAddressNumber.trim()
                    }
                  >
                    Adicionar Endereço
                  </button>
                </div>
              )}
            </div>

            {/* Seção de Confirmação com Senha */}
            <div className={styles.passwordSection}>
              <h3>Confirmar Compra</h3>
              <div className={styles.passwordInput}>
                <label>Digite sua senha para confirmar</label>
                <input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "", general: "" });
                  }}
                  className={errors.password ? styles.error : ""}
                />
                {errors.password && (
                  <span className={styles.error}>{errors.password}</span>
                )}
                {errors.general && (
                  <span className={styles.error}>{errors.general}</span>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.checkout}
                onClick={handleFinalizarCompra}
                // O 'isLoading' agora desabilitará o botão enquanto o modal estiver aberto e processando
                disabled={isLoading}
              >
                {saldoSuficiente
                  ? isLoading
                    ? "Processando..." // Este estado é gerenciado pelo modal agora
                    : "Finalizar Compra"
                  : "Adicionar Saldo"}
              </button>
              <button
                className={styles.keepBuying}
                onClick={() => navigate("/")}
              >
                Continuar comprando
              </button>
            </div>
          </>
        )}

        <Footer />
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          fetchUserData(); // Chamada para atualizar os dados do usuário ao fechar o modal
        }}
      />
      {/* Novo modal de avaliação do fornecedor */}
      <SupplierExperienceModal
        isOpen={isSupplierModalOpen}
        onClose={handleCloseSupplierModal}
        onSubmit={handleSupplierFeedbackSubmit}
        supplierName={supplierToEvaluateName}
      />
      <WalletConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => {
          executePurchase();
          setIsLoading(true)
        }}
        total={total}
        isLoading={isLoading}
      />
    </>
  );
};

export default Cart;