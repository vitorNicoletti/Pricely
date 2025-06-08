import style from "./ProfileModal.module.css";
import profilePlaceholder from "../../assets/profile_placeholder.png";
import { useNavigate } from "react-router-dom";

function ProfileModal({ user }) {
  const navigate = useNavigate();
  const isLogged = !!user && !!user.email;
  return (
    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
      <div className={style.center}>
        {user.imagemPerfil?.dados && user.imagemPerfil?.tipo ? (
          <img
            src={`data:${user.imagemPerfil.tipo};base64,${user.imagemPerfil.dados}`}
            alt={`Imagem de ${user.email}`}
            className={style.avatar}
          />
        ) : (
          <img
            src={profilePlaceholder}
            alt="Imagem padrão de perfil"
            className={style.avatar}
          />
        )}
        {isLogged ? (
          <>
            <p className={style.name}>{user.email}</p>
            <button className={style.icons_btn}>
              <i className="fa-regular fa-heart" />
            </button>
            <button
              className={style.icons_btn}
              onClick={() => navigate("/cart")}
            >
              <i className="fa-solid fa-cart-shopping" />
            </button>
          </>
        ) : (
          <>
            <button
              className={style.btn}
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
            <button
              className={style.btn}
              onClick={() => navigate("/cadastro")}
            >
              Criar conta
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;
