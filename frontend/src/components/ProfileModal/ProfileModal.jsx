import React from "react";
import style from "./ProfileModal.module.css";
import profilePlaceholder from "../../assets/profile_placeholder.png";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
      <div className={style.center}>
        <img
          src={profilePlaceholder}
          alt="Foto de perfil"
          className={style.avatar}
        />
        <h2 className={style.name}>{user.email}</h2>
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
