import "./Detalhes.css";
import cocacola from "../../assets/coca-cola.png";
import avatarRegina from "../../assets/avatar-regina.png";
import avatarCarlos from "../../assets/avatar-carlos.png";
import avatarRicardo from "../../assets/avatar-ricardo.png";
import favoritoIcone from "../../assets/favoritos.png";

import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Detalhes() {
  const { id } = useParams();
  const location = useLocation();

  // pega o produto do estado se vier da navegação
  const [product, setProduct] = useState(location.state?.product || null);

  useEffect(() => {
    if (!product) {
      // fallback: buscar da API pelo ID, se não tiver vindo via state
      fetch(`https://suaapi.com/produtos/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data));
    }
  }, [id, product]);

  return (
    <>
      <Header />
      <div className="detalhes-container">
        <div className="produto-info">
          <img src={favoritoIcone} alt="Favorito" className="icone-favorito" />
          <div className="produto-imagem-container">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={`Imagem de ${product.title}`}
              className="produto-imagem"
            />
          </div>

          <div className="produto-detalhes">
            <h2>{product.title}</h2>
            <span className="produto-promocao">Sale</span>
            <p className="produto-preco">
              R$ <strong>{product.preco_unidade.toFixed(2)}</strong>
            </p>
            <p className="produto-minimo">Minimum order: 50</p>

            <input type="number" placeholder="Quantity" defaultValue={25} />
            <button className="confirmar-btn">Confirm</button>

            <div className="produto-estoque">
              <p>
               {product.description}
              </p>
            </div>
          </div>
        </div>

        <div className="avaliacoes-section">
          <h3>Últimas Avaliações</h3>
          <div className="avaliacoes">
            <div className="avaliacao">
              <div className="estrelas">★★★★★</div>
              <h4>Entrega muito rápida</h4>
              <p>
                Dividi o pedido com mais 2 pessoas e ainda foi entregue muito
                rápido
              </p>
              <div className="div-avatar">
                <img
                  className="imagem-avatar"
                  src={avatarRegina}
                  alt="Regina Oliveira"
                />
                <span className="autor">
                  <b>Regina Oliveira</b>
                  <br></br>28/05/2025
                </span>
              </div>
            </div>

            <div className="avaliacao">
              <div className="estrelas">★★★★☆</div>
              <h4>Gostei, mas achei demor...</h4>
              <p>Foi entregue tudo certo, porém demorou para entregar aqui</p>
              <div className="div-avatar">
                <img
                  className="imagem-avatar"
                  src={avatarCarlos}
                  alt="Carlos Rodriguez"
                />
                <span className="autor">
                  <b>Carlos Rodriguez</b>
                  <br></br>29/05/2025
                </span>
              </div>
            </div>

            <div className="avaliacao">
              <div className="estrelas">★★★★★</div>
              <h4>Como pode conseguir ...</h4>
              <p>
                Comprei apenas 5 e ainda consegui um ótimo preço, como pode?
              </p>
              <div className="div-avatar">
                <img
                  className="imagem-avatar"
                  src={avatarRicardo}
                  alt="Ricardo Silva"
                />
                <span className="autor">
                  <b>Ricardo Silva</b>
                  <br></br>30/05/2025
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pedidos-section">
          <h3>Pedidos Atuais</h3>
          <div className="tabela-pedidos">
            <div className="cabecalho">
              <span>Compradores</span>
              <span>Quantidade</span>
            </div>

            <div className="pedido">
              <div className="comprador">
                <img src={avatarRegina} alt="Regina Oliveira" />
                <div className="cor-pedidos">
                  <strong>Regina Oliveira</strong>
                  <br />
                  <span>14/05/2025 - Curitiba, PR</span>
                </div>
              </div>
              <div className="quantidade">25</div>
            </div>

            <div className="pedido">
              <div className="comprador">
                <img src={avatarCarlos} alt="Carlos Rodriguez" />
                <div className="cor-pedidos">
                  <strong>Carlos Rodriguez</strong>
                  <br />
                  <span>24/05/2025 - Curitiba, PR</span>
                </div>
              </div>
              <div className="quantidade">20</div>
            </div>

            <div className="pedido">
              <div className="comprador">
                <img src={avatarRicardo} alt="Ricardo Silva" />
                <div className="cor-pedidos">
                  <strong>Ricardo Silva</strong>
                  <br />
                  <span>18/05/2025 - Curitiba, PR</span>
                </div>
              </div>
              <div className="quantidade">5</div>
            </div>

            <div className="resumo">
              <span>Restante: 0 of 50</span>
              <div className="progresso">
                <div className="barra">
                  <div className="preenchida" style={{ width: "100%" }}></div>
                </div>
                <div className="status">
                  <span className="check-icon">✔</span>
                  <span>
                    100% <small>Completo</small>
                  </span>
                </div>
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
