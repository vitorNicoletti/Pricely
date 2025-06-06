import style from "./Header.module.css";
import logo_img from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

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
        <button className={style.icons_btn} onClick={() => navigate("/login")}>
          <i className="fa-regular fa-user" />
        </button>
        <i className="fa-solid fa-magnifying-glass" />
        <i className="fa-regular fa-heart" />
        <button className={style.icons_btn} onClick={() => navigate("/cart")}>
          <i className="fa-solid fa-cart-shopping" />
        </button>
      </div>
    </div>
  );
}

export default Header;
