import style from "./Detalhes.module.css";
import favoritoIcone from "../../assets/favoritos.png";
import avatarRegina from "../../assets/avatar-regina.png";
import avatarCarlos from "../../assets/avatar-carlos.png";
import avatarRicardo from "../../assets/avatar-ricardo.png";

import api from "../../api";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CartConfirmModal from "../CartConfirmModal/CartConfirmModal";
import avatar_placeholder from "../../assets/profile_placeholder.png";
import seller_profile_style from "../SellerProfile/SellerProfile.module.css";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

function Detalhes() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [fornecedor, setFornecedor] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const quantityRef = useRef();

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const isLogged = !!user;

  const navigate = useNavigate();

  const minimumOrder = product?.quantidade_minima || 50;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await api.get(`/catalogo/${id}`);
        setProduct(productRes.data);
        if (productRes.data.id_fornecedor) {
          const fornecedorRes = await api.get(
            `/fornecedor/${productRes.data.id_fornecedor}`
          );
          setFornecedor(fornecedorRes.data);
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
      }
    };
    fetchData();
  }, [id]);

  function handleAddToCartClick() {
    if (!isLogged) {
      navigate("/login");
      return;
    }
    setShowCartModal(true);
  }

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
            {product?.imagem.dados && product?.imagem.tipo && (
              <img
                className={style.produtoImagem}
                src={`data:${product.imagem.tipo};base64,${product.imagem.dados}`}
                alt={`Imagem de ${product.nome}`}
              />
            )}
          </div>

          <div className={style.produtoDetalhes}>
            <h2>{product?.nome}</h2>
            <span className={style.produtoPromocao}>Sale</span>
            <p className={style.produtoPreco}>
              R$ <strong>{product?.preco_unidade.toFixed(2)}</strong>
            </p>
            <p className={style.produtoMinimo}>Minimum order: {minimumOrder}</p>

            <input
              type="number"
              placeholder="Quantity"
              defaultValue={25}
              min={1}
              ref={quantityRef}
            />
            <button
              className={style.btn}
              onClick={() => {
                handleAddToCartClick();
              }}
            >
              Adicionar ao Carrinho
            </button>

            <div className={style.produtoEstoque}>
              <p>{product?.descricao}</p>
            </div>

            <div className={style.card_fornecedor}>
              {fornecedor?.imagem?.dados && fornecedor?.imagem?.tipo ? (
                <img
                  src={`data:${fornecedor.imagem.tipo};base64,${fornecedor.imagem.dados}`}
                  alt={`Imagem de ${fornecedor.nomeFantasia}`}
                  className={seller_profile_style.avatar}
                />
              ) : (
                <img
                  src={avatar_placeholder}
                  alt="Imagem padrão de perfil"
                  className={seller_profile_style.avatar}
                />
              )}

              <div className={style.fornecedorInfo}>
                <p>Vendido por:</p>
                <h3 className={style.nomeFornecedor}>
                  {fornecedor?.nome_fantasia}
                </h3>
                <div className={style.botoesFornecedor}>
                  <button
                    className={style.btn}
                    onClick={() => {
                      alert(
                        "Funcionalidade de seguir fornecedor ainda não implementada."
                      );
                    }}
                  >
                    Seguir
                  </button>
                  <button
                    className={style.btn}
                    onClick={() =>
                      window.open(
                        `/fornecedor/${fornecedor?.id_usuario}`,
                        "_blank"
                      )
                    }
                  >
                    Ver Página
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCartModal && (
        <CartConfirmModal
          userRole={user.role}
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
            <p>
              Dividi o pedido com mais 2 pessoas e ainda foi entregue muito
              rápido
            </p>
            <div className={style.divAvatar}>
              <img
                className={style.imagemAvatar}
                src={avatarRegina}
                alt="Regina Oliveira"
              />
              <span className={style.autor}>
                <b>Regina Oliveira</b>
                <br />
                28/05/2025
              </span>
            </div>
          </div>

          <div className={style.avaliacao}>
            <div className={style.estrelas}>★★★★☆</div>
            <h4>Gostei, mas achei demor...</h4>
            <p>Foi entregue tudo certo, porém demorou para entregar aqui</p>
            <div className={style.divAvatar}>
              <img
                className={style.imagemAvatar}
                src={avatarCarlos}
                alt="Carlos Rodriguez"
              />
              <span className={style.autor}>
                <b>Carlos Rodriguez</b>
                <br />
                29/05/2025
              </span>
            </div>
          </div>

          <div className={style.avaliacao}>
            <div className={style.estrelas}>★★★★★</div>
            <h4>Como pode conseguir ...</h4>
            <p>Comprei apenas 5 e ainda consegui um ótimo preço, como pode?</p>
            <div className={style.divAvatar}>
              <img
                className={style.imagemAvatar}
                src={avatarRicardo}
                alt="Ricardo Silva"
              />
              <span className={style.autor}>
                <b>Ricardo Silva</b>
                <br />
                30/05/2025
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={style.pedidosSection}>
        <h3>Pedidos Atuais</h3>
        <div className={style.tabelaPedidos}>
          <div className={style.cabecalho}>
            <span>Compradores</span>
            <span>Quantidade</span>
          </div>

          <div className={style.pedido}>
            <div className={style.comprador}>
              <img src={avatarRegina} alt="Regina Oliveira" />
              <div className={style.corPedidos}>
                <strong>Regina Oliveira</strong>
                <br />
                <span>14/05/2025 - Curitiba, PR</span>
              </div>
            </div>
            <div className={style.quantidade}>25</div>
          </div>

          <div className={style.pedido}>
            <div className={style.comprador}>
              <img src={avatarCarlos} alt="Carlos Rodriguez" />
              <div className={style.corPedidos}>
                <strong>Carlos Rodriguez</strong>
                <br />
                <span>24/05/2025 - Curitiba, PR</span>
              </div>
            </div>
            <div className={style.quantidade}>20</div>
          </div>

          <div className={style.pedido}>
            <div className={style.comprador}>
              <img src={avatarRicardo} alt="Ricardo Silva" />
              <div className={style.corPedidos}>
                <strong>Ricardo Silva</strong>
                <br />
                <span>18/05/2025 - Curitiba, PR</span>
              </div>
            </div>
            <div className={style.quantidade}>5</div>
          </div>

          <div className={style.resumo}>
            <span>Restante: 0 of 50</span>
            <div className={style.progresso}>
              <div className={style.barra}>
                <div
                  className={style.preenchida}
                  style={{ width: "100%" }}
                ></div>
              </div>
              <div className={style.status}>
                <span className={style.checkIcon}>✔</span>
                <span>
                  100% <small>Completo</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Detalhes;
