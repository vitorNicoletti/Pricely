import style from "./Header.module.css"

function Header() {
  return (
    <div className={style.header}>
      <div className={style.logo}></div>
      <div className={style.navbar}></div>
      <div className={style.icones}></div>
    </div>
  );
}

export default Header;