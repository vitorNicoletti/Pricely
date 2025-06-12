import style from "./Header.module.css";
import logo_img from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal.jsx";
import { useState, useEffect } from "react";
import WalletModal from "../WalletModal/WalletModal.jsx";
import api from "../../api.js";

function Header() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const toggleWalletModal = () => {
    if (!isWalletOpen) {
      // Se wallet não está aberto, feche o profile antes de abrir wallet
      setIsProfileOpen(false);
    }
    setIsWalletOpen(!isWalletOpen);
  };

  const toggleProfileModal = () => {
    if (!isProfileOpen) {
      // Se profile não está aberto, feche o wallet antes de abrir profile
      setIsWalletOpen(false);
    }
    setIsProfileOpen(!isProfileOpen);
  };
  useEffect(() => {
    async function loadUserData() {
      try {
        // Tenta buscar como vendedor
        const userResponse = await api.get("/vendedor/me");
        userResponse.data.role = "vendedor"; // Adiciona a role para identificar o tipo de usuário
        localStorage.setItem("user", JSON.stringify(userResponse.data));
        setUser(userResponse.data);
      } catch (vendedorErr) {
        try {
          // Se falhar, tenta buscar como fornecedor
          const userResponse = await api.get("/fornecedor/me");
          userResponse.data.role = "fornecedor"; // Adiciona a role para identificar o tipo de usuário
          localStorage.setItem("user", JSON.stringify(userResponse.data));
          setUser(userResponse.data);
        } catch (fornecedorErr) {
          console.error("Erro ao buscar dados do usuário:", fornecedorErr);
        }
      }
    }
    loadUserData();
  }, []);

  return (
    <div className={style.header}>
      <div className={style.logo_div}>
        <img
          className={style.logo_img}
          onClick={() => navigate("/")}
          src={logo_img}
          alt="logo"
        />
      </div>
      <div className={style.navbar}>
        <a onClick={() => navigate("/")}>Home</a>
        <a onClick={() => navigate("/about")}>Sobre</a>
        <a onClick={() => navigate("/help")}>Fale Conosco</a>
      </div>
      <div className={style.navbar}>
        {/* Search */}
        <button className={style.icons_btn}>
          <i className="fa-solid fa-magnifying-glass" />
        </button>

        {/* Wallet */}
        <div className={style.profileWrapper}>
          <button className={style.icons_btn} onClick={toggleWalletModal}>
            <i className="fa-solid fa-wallet" />
          </button>
          {isWalletOpen && (
            <div className={style.modalWrapper}>
              <WalletModal
                onClose={toggleWalletModal}
                carteira={user?.carteira}
              />
            </div>
          )}
        </div>
        {/* Profile */}
        <div className={style.profileWrapper}>
          <button className={style.icons_btn} onClick={toggleProfileModal}>
            <i className="fa-regular fa-user" />
          </button>
          {isProfileOpen && (
            <div className={style.modalWrapper}>
              <ProfileModal user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
