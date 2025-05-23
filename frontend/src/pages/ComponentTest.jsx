import ProductCard from "../components/ProductCard/ProductCard";
import style from "./ComponentTest.module.css"

function ComponentTest() {
    return (
        <>
            <div className={style.divgamer}>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
        </>
    );
}

export default ComponentTest;