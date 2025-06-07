import style from "./ProfileModal.module.css";
import profilePlaceholder from "../../assets/profile_placeholder.png";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ user }) => {
  const navigate = useNavigate();
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
        <p className={style.name}>{user.email}</p>
        <button className={style.icons_btn}>
          <i className="fa-regular fa-heart" />
        </button>

        <button className={style.icons_btn} onClick={() => navigate("/cart")}>
          <i className="fa-solid fa-cart-shopping" />
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
