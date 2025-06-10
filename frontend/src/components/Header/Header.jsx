import style from "./Header.module.css";
import logo_img from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal.jsx";
import { useState, useEffect } from "react";
import api from "../../api.js";

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Nenhum token de autenticação encontrado.");
      return;
    }

    async function fetchUserData() {
      const user_data = await api.get("/vendedor/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(user_data.data);
      localStorage.setItem("user", JSON.stringify(user_data.data));
    }

    fetchUserData().catch((err) => {
      console.error("Erro ao buscar dados do usuário:", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    });
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
        {/* TODO: Usar classes para os ícones no lugar dos botoes */}
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
        <button className={style.icons_btn}>
          <i className="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    </div>
  );
}

export default Header;
