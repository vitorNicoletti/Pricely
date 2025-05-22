import style from "./Header.module.css"
import logo_img from "../../assets/logo.png"

function Header() {
  return (
    <div className={style.header}>
      <div className={style.logo_div}>
        <img className={style.logo_img} src={logo_img} alt="logo" />
      </div>
      <div className={style.navbar}></div>
      <div className={style.icones}></div>
    </div>
  );
}

export default Header;