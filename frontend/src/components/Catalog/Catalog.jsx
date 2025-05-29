import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Catalog.module.css';
import ProductCard from '../ProductCard/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

/* //Essa é o correto que vai ser implementado depois
    useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);
*/
  
  useEffect(() => {
    axios.get('https://fakestoreapi.com/products') // API fake, é para trocar para a nossa do backend provavel 3000
      .then(response => {
        const enrichedProducts = response.data.map((product, index) => ({ // Prenchendo dados faltantes
          ...product,
          location: ['CURITIBA', 'SÃO PAULO', 'RIO DE JANEIRO'][index % 3],
          rating: (product.rating?.rate || (Math.random() * 5 + 1)).toFixed(1),
          unit: 'unidade',
          discount: Math.random() > 0.5,
        }));
        setProducts(enrichedProducts);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
      });
  }, []);

  const filteredProducts = products.filter((p) => {
    return (
      (locationFilter === '' || p.location === locationFilter) &&
      (ratingFilter === '' || parseFloat(p.rating) >= parseFloat(ratingFilter))
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [locationFilter, ratingFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const uniqueLocations = [...new Set(products.map((p) => p.location))];

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
            <div className={styles.iconGroup}>
              <span className="material-icons">tune</span>
              <span>Filter</span>
            </div>
            <div className={styles.resultInfo}>
              Mostrando {paginatedProducts.length} de {filteredProducts.length} produtos
            </div>
          </div>

          <div className={styles.rightGroup}>
            <label className={styles.label}>
              Local:
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className={styles.select}>
                <option value="">Todos</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className={styles.pagination}>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className={styles.pageButton}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className={styles.pageButton}>
              Next
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
