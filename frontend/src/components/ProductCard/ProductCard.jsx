import style from "./ProductCard.module.css"
import logo from "../../assets/logo_old.png"

function ProductCard(props) {
  return (
    <>
      <div className={style.card}>
        <div className={style.img_div}>
          <img src={logo} alt="imagem do produto" className={style.img_produto} />
          {/* <img src={logo} alt="props.produto.imagem" className={style.img_produto} /> */}
        </div>
        <div className={style.card_texts}>
          <h2 className={style.nome_produto}>NOME DO PRODUTO</h2>
          {/* <h2 className={style.nome_produto}>{props.produto.nome}</h2> */}
          <div className={style.infos_esquerda_div}>
            <p className={style.estrela}><i className="fa-solid fa-star" /> 5.0</p>
            <p><i className="fa-solid fa-location-dot" /> CURITIBA</p>
            <p><i className="fa-solid fa-percent" /> Sem descontos</p>
            {/* <p className={style.estrela}><i className="fa-solid fa-star" />{props.produto.avaliacao}</p>
            <p><i className="fa-solid fa-location-dot" /> {props.produto.local}</p>
            <p><i className="fa-solid fa-percent" /> {props.produto.desconto}</p> */}
          </div>
          <div>
            <h2>R$ 9,99</h2>
            {/* <h2>R$ {props.produto.preco}</h2> */}
            <p>por unidade</p>
          </div>
          {/* <p className={style.fornecedor_text}>{props.produto.fornecedor}</p> */}
          <p className={style.fornecedor_text}>fornecedor</p>
        </div>
      </div>
    </>
  );
}

export default ProductCard;