import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../api";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./Catalog.module.css";
import ProductCard from "../ProductCard/ProductCard";

const Catalog = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const [ratingFilter, setRatingFilter] = useState("");

  //Essa é o correto que vai ser implementado depois
  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);
  
  const filteredProducts = products.filter((p) => {
    const ratingPass =
      ratingFilter === "" || parseFloat(p.rating) >= parseFloat(ratingFilter);
    const categoryPass = categoryFilter === "" || p.category === categoryFilter;
    const minPricePass =
      minPriceFilter === "" ||
      parseFloat(p.price) >= parseFloat(minPriceFilter);
    const maxPricePass =
      maxPriceFilter === "" ||
      parseFloat(p.price) <= parseFloat(maxPriceFilter);

    return ratingPass && categoryPass && minPricePass && maxPricePass;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [ratingFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div>
      <Header />

      <div className={styles.header}>
        <div>
          <h2>Catálogo</h2>
          <p>Home &gt; Shop</p>
        </div>
      </div>

      <main className={styles.catalogLayout}>
        <div className={styles.filterBar}>
          <div className={styles.leftGroup}>
            <div onClick={toggleFilterModal} className={styles.iconGroup}>
              <span className="material-icons">tune</span>
              <span>Filter</span>
            </div>
            <div className={styles.resultInfo}>
              Mostrando {paginatedProducts.length} de {filteredProducts.length}{" "}
              produtos
            </div>
          </div>

          <div className={styles.rightGroup}>
            <label className={styles.label}>
              Nota mínima:
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className={styles.inputSmall}
              />
            </label>
            <label className={styles.label}>
              Mostrar:
              <input
                type="number"
                min={1}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className={styles.inputSmall}
              />
            </label>
          </div>
        </div>

        <section className={styles.productsArea}>
          <div className={styles.productsList}>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id_produto} product={product} />
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`${styles.pageButton} ${
                  currentPage === i + 1 ? styles.active : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </section>
        {isFilterModalOpen && (
          <div className={styles.modalOverlay} onClick={toggleFilterModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Filtros</h3>

              <label className={styles.label}>
                Categoria:
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={styles.inputSmall}
                >
                  <option value="">Todas</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Roupas">Roupas</option>
                  <option value="Alimentos">Alimentos</option>
                </select>
              </label>

              <label className={styles.label}>
                Preço mínimo:
                <input
                  type="number"
                  min="0"
                  value={minPriceFilter}
                  onChange={(e) => setMinPriceFilter(e.target.value)}
                  className={styles.inputSmall}
                />
              </label>

              <label className={styles.label}>
                Preço máximo:
                <input
                  type="number"
                  min="0"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                  className={styles.inputSmall}
                />
              </label>

              <label className={styles.label}>
                Nota mínima:
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className={styles.inputSmall}
                />
              </label>

              <label className={styles.label}>
                Mostrar por página:
                <input
                  type="number"
                  min={1}
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className={styles.inputSmall}
                />
              </label>

              <button
                onClick={toggleFilterModal}
                className={styles.closeButton}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
