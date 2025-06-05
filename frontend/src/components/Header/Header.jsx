import style from "./Header.module.css";
import logo_img from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal.jsx";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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
        <a href="/">Home</a>
        <a href="/about">Sobre</a>
        <a href="/help">Fale Conosco</a>
      </div>
      <div className={style.navbar}>
        {/* TODO: Usar classes para os ícones no lugar dos botoes */}
        <div className={style.profileWrapper}>
          <button className={style.icons_btn} onClick={toggleModal}>
            <i className="fa-regular fa-user" />
          </button>
          {isOpen && (
            <div className={style.modalWrapper}>
              <ProfileModal
                onClose={toggleModal}
                user={{
                  name: "João Silva",
                  avatar: "",
                }}
              />
            </div>
          )}
        </div>
        <button className={style.icons_btn}>
          <i className="fa-solid fa-magnifying-glass" />
        </button>

      </div>
    </div>
  );
}

export default Header;
