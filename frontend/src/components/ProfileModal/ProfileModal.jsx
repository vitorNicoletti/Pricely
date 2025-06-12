import { useNavigate } from "react-router-dom";
import profilePlaceholder from "../../assets/profile_placeholder.png";
import style from "./ProfileModal.module.css";
import { useState } from "react";

function ProfileModal({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const isLogged = !!user;
  console.log(user)

  // 1) Pegue sempre user.email OU nome_fantasia
  const displayUserName = user?.email ?? user?.nome_fantasia ?? "Usuário";

  // 2) Imagem: fornecedor usa user.imagem; vendedor user.imagemPerfil
  const imgData = user?.imagem?.dados ?? user?.imagemPerfil?.dados;
  const imgType = user?.imagem?.tipo ?? user?.imagemPerfil?.tipo;

  // Deslogar
  function sairHandler() {
    // Limpa o localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    // Redireciona para a página inicial
    navigate("/");
    window.location.reload(true);
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
            <p className={style.name}>{displayUserName}</p>

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
          <button
            className={style.btn}
            style={{ backgroundColor: "gray" }}
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
