import style from "./ProductCard.module.css";

function ProductCard({ product }) {
  return (
    <div className={style.card}>
      <div className={style.img_div}>
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={`Imagem de ${product.title}`}
          className={style.img_produto}
        />
      </div>
      <div className={style.card_texts}>
        <h2 className={style.nome_produto}>{product.title}</h2>
        <div className={style.infos_esquerda_div}>
          <p className={style.estrela}>
            <i className="fa-solid fa-star" /> {product.rating}
          </p>
          <p>
            <i className="fa-solid fa-location-dot" /> {product.location}
          </p>
          <p>
            <i className="fa-solid fa-percent" />{" "}
            {product.discount ? "Com desconto" : "Sem descontos"}
          </p>
        </div>
        <div>
          <h2>R$ {product.price.toFixed(2)}</h2>
          <p>por {product.unit}</p>
        </div>
        <p className={style.fornecedor_text}>Fornecedor genérico</p>
      </div>
      <div className={style.btn_div}>
        <button className={style.btn}>
          <i class="fa-solid fa-cart-shopping" />
        </button>
        <a href="/detalhes" className={style.btn}>Ver Detalhes</a>
      </div>
    </div>
  );
}

export default ProductCard;
