import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import api from "../../api";

import styles from "./Cart.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

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
  const [isLoading, setIsLoading] = useState(false); // Novo estado para o loading

  // Novos estados para o modal de avaliação do fornecedor
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEvaluateId, setSupplierToEvaluateId] = useState(null);
  const [supplierToEvaluateName, setSupplierToEvaluateName] = '';


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

  // Calcula os valores quando cartItems mudar
  const { subtotal, discount, total } = useMemo(() => {
    if (!cartItems.compras) return { subtotal: 0, discount: 0, total: 0 };

    let subtotal = 0;
    let discount = 0;

    cartItems.compras.forEach((item) => {
      const preco = item.preco_unidade;
      const qtd = item.quantidade;
      const promocoes = item.produto.promocoes || [];

      subtotal += preco * qtd;

      // Ordena promoções da maior para a menor quantidade para pegar a mais vantajosa
      const promocoesValidas = promocoes
        .filter((promo) => qtd >= promo.quantidade)
        .sort((a, b) => b.quantidade - a.quantidade);

      if (promocoesValidas.length > 0) {
        const melhorPromo = promocoesValidas[0];
        const descontoProduto =
          (melhorPromo.desc_porcentagem / 100) * (preco * qtd);
        discount += descontoProduto;
      }
      console.log(promocoes)
    });

    const total = subtotal - discount;

    return { subtotal, discount, total };
  }, [cartItems]);

  // Verifica se o saldo é suficiente
  const saldoSuficiente = useMemo(() => {
    if (!user?.carteira?.saldo || !total) return false;
    return parseFloat(user.carteira.saldo) >= total;
  }, [user, total]);

  const handleFinalizarCompra = async () => {
    if (saldoSuficiente) {
      // Verifica se tem endereço selecionado
      if (!selectedAddress) {
        setErrors({ address: "Selecione um endereço para entrega" });
        return;
      }

      // Verifica se tem senha
      if (!password.trim()) {
        setErrors({ password: "Digite sua senha para confirmar a compra" });
        return;
      }

      // Define o estado de loading como true antes de iniciar a requisição
      setIsLoading(true);

      try {
        // Busca o endereço selecionado
        let selectedAddressData;
        if (user?.addresses) {
          selectedAddressData = user.addresses.find(
            (addr) => (addr.id || addr.index) === selectedAddress
          );
        }

        if (!selectedAddressData) {
          setErrors({ address: "Endereço selecionado não encontrado" });
          return;
        }

        const body = {
          senha: password,
          rua: selectedAddressData.street,
          numero: selectedAddressData.number,
          complemento: selectedAddressData.complement || "",
          total,
        };

        const response = await api.post("/carrinho/finalizar", body);

        // Assumimos que a resposta do backend incluirá o ID e nome do vendedor.
        // O backend precisa garantir que esses esses dados são retornados.
        const id_vendedor = response.data.id_vendedor;
        const nome_vendedor = response.data.nome_vendedor;

        // Abre o modal de avaliação do fornecedor
        setSupplierToEvaluateId(id_vendedor);
        setSupplierToEvaluateName(nome_vendedor);
        setIsSupplierModalOpen(true);


      } catch (error) {
        console.error("Erro ao finalizar compra:", error);
        setErrors({
          general: "Erro ao finalizar compra. Verifique sua senha.",
        });
      } finally {
        // Define o estado de loading como false após a requisição (seja sucesso ou erro)
        setIsLoading(false);
        navigate("/")
      }
    } else {
      // Abre modal para adicionar saldo
      setIsPaymentModalOpen(true);
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
      fullAddress: `${newAddressStreet.trim()}, ${newAddressNumber.trim()}${
        newAddressComplement.trim() ? `, ${newAddressComplement.trim()}` : ""
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

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Busca os itens do carrinho do Usuario
    const fetchCart = async () => {
      try {
        const response = await api.get("/vendedor/carrinho");
        setCartItems(response.data);
      } catch (error) {
        console.error("Erro ao buscar itens do carrinho:", error);
      }
    };
    fetchCart();
  }, [navigate]);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Seu Carrinho</h1>

        <div className={styles.items}>
          {!cartItems.compras || cartItems.compras.length === 0 ? (
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
            cartItems.compras.map((item) => (
              <div key={item.id} className={styles.item}>
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

        {cartItems.compras && cartItems.compras.length > 0 && (
          <>
            <div className={styles.summary}>
              <h3>Resumo</h3>
              <p>
                <span>Subtotal</span>
                <span>R${subtotal.toFixed(2)}</span>
              </p>
              <p>
                <span>Desconto</span>
                <span>- R${discount.toFixed(2)}</span>
              </p>
              <p className={styles.total}>
                <span>Total</span>
                <span>R${total.toFixed(2)}</span>
              </p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.checkout}
                onClick={handleFinalizarCompra}
                disabled={isLoading} // Desabilita o botão quando isLoading for true
              >
                {saldoSuficiente
                  ? isLoading
                    ? "Carregando..."
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
    </>
  );
};

export default Cart;
