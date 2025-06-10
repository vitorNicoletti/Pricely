import { useNavigate } from "react-router-dom";
import profilePlaceholder from "../../assets/profile_placeholder.png";
import style from "./ProfileModal.module.css";

function ProfileModal() {
  const navigate = useNavigate();

  // 1) Recupera o perfil do localStorage
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isLogged = !!user;

  // 2) Pegue sempre user.email
  const displayEmail = user?.email ?? "";

  // 3) Imagem: fornecedor usa user.imagem; vendedor user.imagemPerfil
  const imgData = user?.imagem?.dados ?? user?.imagemPerfil?.dados;
  const imgType = user?.imagem?.tipo  ?? user?.imagemPerfil?.tipo;

  return (
    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
      <div className={style.center}>
        <img
          src={
            imgData
              ? `data:${imgType};base64,${imgData}`
              : profilePlaceholder
          }
          alt="Avatar"
          className={style.avatar}
          onClick={() => {
            if (!user?.role) return;

            if (user.role === "fornecedor") {
              navigate(`/fornecedor/${user.id_usuario}`);
            } else if (user.role === "vendedor") {
              navigate("/vendedor");
            }
          }}
        />

        {isLogged && (
          <>
            {/* agora o email sempre aparece abaixo da foto */}
            <p className={style.name}>{displayEmail}</p>

            <button className={style.icons_btn}>
              <i className="fa-regular fa-heart" />
            </button>
            <button
              className={style.icons_btn}
              onClick={() => navigate("/cart")}
            >
              <i className="fa-solid fa-cart-shopping" />
            </button>
            <button
              className={style.btn}
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                window.location.reload();
              }}
            >
              Sair
            </button>
          </>
        )}

        {!isLogged && (
          <>
            <button className={style.btn} onClick={() => navigate("/login")}>
              Entrar
            </button>
            <button className={style.btn} onClick={() => navigate("/cadastro")}>
              Criar conta
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;