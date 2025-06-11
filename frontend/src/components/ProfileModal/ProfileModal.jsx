import { useNavigate } from "react-router-dom";
import profilePlaceholder from "../../assets/profile_placeholder.png";
import style from "./ProfileModal.module.css";
import { useState } from "react";

function ProfileModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 1) Recupera o perfil do localStorage
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isLogged = !!user;

  // 2) Pegue sempre user.email
  const displayEmail = user?.email ?? user?.nome_fantasia ?? "Usuário";

  // 3) Imagem: fornecedor usa user.imagem; vendedor user.imagemPerfil
  const imgData = user?.imagem?.dados ?? user?.imagemPerfil?.dados;
  const imgType = user?.imagem?.tipo ?? user?.imagemPerfil?.tipo;

  function sairHandler() {
    // Limpa o localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // Redireciona para a página inicial
    navigate("/");
    window.location.reload(true)
  }

  return (
    <div className={style.modal} onClick={(e) => e.stopPropagation()}>
      <div className={style.center}>
        <img
          src={
            imgData ? `data:${imgType};base64,${imgData}` : profilePlaceholder
          }
          alt="Avatar"
          className={style.avatar}
          onClick={() => {
            // Redireciona pra pagina de login se não estiver logado
            if (!isLogged) navigate("/login");

            // Redireciona para a página do fornecedor ou vendedor
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

            {user.role === "vendedor" && (
              <>
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
            )}

            <button
              className={style.btn}
              onClick={() => {
                setIsOpen(true);
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
      {isOpen && (
        <div className={style.sairModal}>
          Deseja mesmo sair da sua conta?
          <button className={style.btn} onClick={sairHandler}>
            Sair
          </button>
          <button className={style.btn} style={{ backgroundColor: "gray" }} onClick={() => setIsOpen(false)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
