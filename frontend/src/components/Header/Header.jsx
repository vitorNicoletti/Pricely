import style from "./Header.module.css"
import logo_img from "../../assets/logo.png"

function Header() {
  return (

    <div className={style.header}>

      <div className={style.logo_div}>
        <img className={style.logo_img} src={logo_img} alt="logo" />
      </div>
      <div className={style.navbar}>
        <a href="/home">Home</a>
        <a href="/shop">Shop</a>
        <a href="/about">Sobre</a>
        <a href="/help">Fale Conosco</a>
      </div>
      <div className={style.navbar}>
        <i class="fa-regular fa-user" />
        <i className="fa-solid fa-magnifying-glass" />
        <i class="fa-regular fa-heart" />
        <i class="fa-solid fa-cart-shopping" />
      </div>
    </div>
  );
}

export default Header;