import style from "./Header.module.css";
import logo_img from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal.jsx";
import { useState, useEffect } from "react";
import WalletModal from "../WalletModal/WalletModal.jsx";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isWalletOpen, setIsWalletOpen] = useState(false); // novo estado

  const toggleWalletModal = () => {
    setIsWalletOpen(!isWalletOpen);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    async function loadUserData() {
      let userData = localStorage.getItem("user");
      if (userData) {
        userData = JSON.parse(userData);
        setUser(userData);
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
                carteira={user.carteira}
              />
            </div>
          )}
        </div>
        {/* Profile */}
        <div className={style.profileWrapper}>
          <button className={style.icons_btn} onClick={toggleModal}>
            <i className="fa-regular fa-user" />
          </button>
          {isOpen && (
            <div className={style.modalWrapper}>
              <ProfileModal onClose={toggleModal} user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
