import { useNavigate } from "react-router-dom";
import style from "./ProductCard.module.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className={style.card}>
      <div className={style.img_div}>
        {product.imagem?.dados && product.imagem?.tipo && (
          <img
            src={`data:${product.imagem.tipo};base64,${product.imagem.dados}`}
            alt={`Imagem de ${product.nome}`}
            className={style.img_produto}
          />
        )}
      </div>
      <div className={style.card_texts}>
        <h2 className={style.nome_produto}>{product.nome}</h2>
        <div className={style.infos_esquerda_div}>
          <p className={style.estrela}>
            <i className="fa-solid fa-star" />
            {product.avaliacao_media}
          </p>
          <p>
            <i className="fa-solid fa-percent" />{" "}
            {product.promocoes?.length > 0 ? "Com desconto" : "Sem descontos"}
          </p>
        </div>
        <div>
          <h2>R$ {product.preco_unidade.toFixed(2)}</h2>
          <p>por unidade</p>
        </div>
        <p className={style.fornecedor_text}>
          {product.promocoes?.[0]?.nome_fornecedor || "Fornecedor genérico"}
        </p>
      </div>
      <div className={style.btn_div}>
        <button
          onClick={() => navigate(`/details/${product.id_produto}`)}
          className={style.btn}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
