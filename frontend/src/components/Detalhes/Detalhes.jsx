import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "./Detalhes.module.css";
import sellerStyle from "../SellerProfile/SellerProfile.module.css";
import favoritoIcone from "../../assets/favoritos.png";
import avatarRegina from "../../assets/avatar-regina.png";
import avatarCarlos from "../../assets/avatar-carlos.png";
import avatarRicardo from "../../assets/avatar-ricardo.png";
import avatar_placeholder from "../../assets/profile_placeholder.png";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CartConfirmModal from "../CartConfirmModal/CartConfirmModal";
import api from "../../api";

export default function Detalhes() {
  const { id } = useParams();                   // id do produto
  const navigate = useNavigate();
  const quantityRef = useRef();

  // estados de dados
  const [product, setProduct] = useState(null);
  const [fornecedor, setFornecedor] = useState(null);

  // modal de carrinho
  const [showCartModal, setShowCartModal] = useState(false);

  // dados de autenticação
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isLogged = !!user;

  // follow
  const [isVendor, setIsVendor] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // busca produto e fornecedor
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prod } = await api.get(`/catalogo/${id}`);
        setProduct(prod);
        if (prod.id_fornecedor) {
          const { data: f } = await api.get(`/fornecedor/${prod.id_fornecedor}`);
          setFornecedor(f);
        }
      } catch (err) {
        console.error("Erro ao buscar produto/fornecedor:", err);
      }
    }
    fetchData();
  }, [id]);

  // verifica vendor e follow ao carregar fornecedor
  useEffect(() => {
    if (!fornecedor) return;
    const isOwner = user && String(user.id_usuario) === String(fornecedor.id_usuario);

    // verifica se é vendedor para exibir botão
    if (isLogged && !isOwner) {
      api.get("vendedor/me")
         .then(() => setIsVendor(true))
         .catch(() => setIsVendor(false));
    }

    // obtém status de seguimento
    api.get(`seguindo/${fornecedor.id_usuario}`)
       .then(res => setIsFollowing(res.data.followed))
       .catch(err => console.error("Erro ao consultar follow:", err));
  }, [fornecedor, user, isLogged]);

  // alterna seguir / deixar de seguir
  const toggleFollow = () => {
    if (!fornecedor) return;
    const fid = fornecedor.id_usuario;
    const req = isFollowing
      ? api.delete(`/seguindo/${fid}`)
      : api.post(`/seguindo/${fid}`);

    req
      .then(res => setIsFollowing(res.data.followed))
      .catch(err => console.error("Erro ao (des)seguir:", err));
  };

  // adicionar ao carrinho
  const handleAddToCartClick = () => {
    if (!isLogged) {
      navigate("/login");
      return;
    }
    setShowCartModal(true);
  };

  const minimumOrder = product?.quantidade_minima || 50;

  return (
    <>
      <Header />

      <div className={style.detalhesContainer}>
        <div className={style.produtoInfo}>
          <img
            src={favoritoIcone}
            alt="Favorito"
            className={style.iconeFavorito}
          />

          <div className={style.produtoImagemContainer}>
            {product?.imagem.dados && (
              <img
                className={style.produtoImagem}
                src={`data:${product.imagem.tipo};base64,${product.imagem.dados}`}
                alt={product.nome}
              />
            )}
          </div>

          <div className={style.produtoDetalhes}>
            <h2>{product?.nome}</h2>
            <span className={style.produtoPromocao}>Sale</span>
            <p className={style.produtoPreco}>
              R$ <strong>{product?.preco_unidade.toFixed(2)}</strong>
            </p>
            <p className={style.produtoMinimo}>
              Minimum order: {minimumOrder}
            </p>

            <input
              type="number"
              placeholder="Quantity"
              defaultValue={minimumOrder}
              min={1}
              ref={quantityRef}
            />
            <button
              className={style.btn}
              onClick={handleAddToCartClick}
            >
              Adicionar ao Carrinho
            </button>

            <div className={style.produtoEstoque}>
              <p>{product?.descricao}</p>
            </div>

            {fornecedor && (
              <div className={style.card_fornecedor}>
                <img
                  src={
                    fornecedor.imagem?.dados
                      ? `data:${fornecedor.imagem.tipo};base64,${fornecedor.imagem.dados}`
                      : avatar_placeholder
                  }
                  alt={fornecedor.nomeFantasia}
                  className={sellerStyle.avatar}
                />

                <div className={style.fornecedorInfo}>
                  <p>Vendido por:</p>
                  <h3 className={style.nomeFornecedor}>
                    {fornecedor.nomeFantasia || fornecedor.nome_fantasia}
                  </h3>

                  <div className={style.botoesFornecedor}>
                    {isVendor && String(user.id_usuario) !== String(fornecedor.id_usuario) && (
                      <button
                        className={`${sellerStyle.btn} ${isFollowing ? sellerStyle.following : ""}`}
                        onClick={toggleFollow}
                      >
                        {isFollowing ? "Seguindo ✓" : "Seguir"}
                      </button>
                    )}
                    <button
                      className={style.btn}
                      onClick={() => window.open(`/fornecedor/${fornecedor.id_usuario}`, "_blank")}
                    >
                      Ver Página
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCartModal && (
        <CartConfirmModal
          open={showCartModal}
          onClose={() => setShowCartModal(false)}
          quantityRef={quantityRef}
          product={product}
          minimumOrder={minimumOrder}
        />
      )}

      <div className={style.avaliacoesSection}>
        <h3>Últimas Avaliações</h3>
        <div className={style.avaliacoes}>
          <div className={style.avaliacao}>
            <div className={style.estrelas}>★★★★★</div>
            <h4>Entrega muito rápida</h4>
            <p>Dividi o pedido com mais 2 pessoas e ainda foi entregue muito rápido</p>
            <div className={style.divAvatar}>
              <img className={style.imagemAvatar} src={avatarRegina} alt="Regina Oliveira" />
              <span className={style.autor}><b>Regina Oliveira</b><br/>28/05/2025</span>
            </div>
          </div>

          <div className={style.avaliacao}>
            <div className={style.estrelas}>★★★★☆</div>
            <h4>Gostei, mas achei demora...</h4>
            <p>Foi entregue tudo certo, porém demorou para entregar aqui</p>
            <div className={style.divAvatar}>
              <img className={style.imagemAvatar} src={avatarCarlos} alt="Carlos Rodriguez" />
              <span className={style.autor}><b>Carlos Rodriguez</b><br/>29/05/2025</span>
            </div>
          </div>

          <div className={style.avaliacao}>
            <div className={style.estrelas}>★★★★★</div>
            <h4>Comprei só 5 e consegui ótimo preço</h4>
            <p>Como pode?</p>
            <div className={style.divAvatar}>
              <img className={style.imagemAvatar} src={avatarRicardo} alt="Ricardo Silva" />
              <span className={style.autor}><b>Ricardo Silva</b><br/>30/05/2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className={style.pedidosSection}>
        <h3>Pedidos Atuais</h3>
        <div className={style.tabelaPedidos}>
          <div className={style.cabecalho}><span>Compradores</span><span>Quantidade</span></div>

          <div className={style.pedido}>
            <div className={style.comprador}>
              <img src={avatarRegina} alt="Regina Oliveira" />
              <div className={style.corPedidos}><strong>Regina Oliveira</strong><br/><span>14/05/2025 - Curitiba, PR</span></div>
            </div>
            <div className={style.quantidade}>25</div>
          </div>

          <div className={style.pedido}>
            <div className={style.comprador}>
              <img src={avatarCarlos} alt="Carlos Rodriguez" />
              <div className={style.corPedidos}><strong>Carlos Rodriguez</strong><br/><span>24/05/2025 - Curitiba, PR</span></div>
            </div>
            <div className={style.quantidade}>20</div>
          </div>

          <div className={style.pedido}>
            <div className={style.comprador}>
              <img src={avatarRicardo} alt="Ricardo Silva" />
              <div className={style.corPedidos}><strong>Ricardo Silva</strong><br/><span>18/05/2025 - Curitiba, PR</span></div>
            </div>
            <div className={style.quantidade}>5</div>
          </div>

          <div className={style.resumo}>
            <span>Restante: 0 of 50</span>
            <div className={style.progresso}>
              <div className={style.barra}><div className={style.preenchida} style={{width: "100%"}}/></div>
              <div className={style.status}><span className={style.checkIcon}>✔</span><span>100% <small>Completo</small></span></div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}