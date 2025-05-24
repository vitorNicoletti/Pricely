import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Catalog.module.css';

const Catalog = () => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const products = [
    {
      id: 1,
      title: 'Coca-cola Engradado vidro 350ml',
      rating: 4.7,
      location: 'CURITIBA',
      discount: false,
      price: 3.0,
      unit: 'unidade',
      image: 'null',
      description: 'Coca-cola distribuidora',
    },
    {
      id: 2,
      title: 'Brinquedo do Lucas Neto',
      rating: 4.9,
      location: 'CURITIBA',
      discount: false,
      price: 50.0,
      unit: 'unidade',
      image: 'null',
      description: 'Distribuidora de brinquedos',
    },
    {
      id: 3,
      title: 'Produto 3',
      rating: 4.2,
      location: 'SÃO PAULO',
      discount: true,
      price: 20.0,
      unit: 'unidade',
      image: 'null',
      description: 'Descrição do produto 3',
    },
    {
      id: 4,
      title: 'Produto 4',
      rating: 4.6,
      location: 'SÃO PAULO',
      discount: false,
      price: 35.0,
      unit: 'unidade',
      image: 'null',
      description: 'Descrição do produto 4',
    },
    {
      id: 5,
      title: 'Produto 5',
      rating: 4.1,
      location: 'RIO DE JANEIRO',
      discount: false,
      price: 12.0,
      unit: 'unidade',
      image: 'null',
      description: 'Descrição do produto 5',
    },
  ];

  const filteredProducts = products.filter(p => {
    return (
      (locationFilter === '' || p.location === locationFilter) &&
      (ratingFilter === '' || p.rating >= parseFloat(ratingFilter))
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const uniqueLocations = [...new Set(products.map(p => p.location))];

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
            <div className={styles.layoutToggle}>
              <span className="material-icons">grid_view</span>
              <span className="material-icons">view_list</span>
            </div>
            <div className={styles.resultInfo}>
              Mostrando 1–7 de 32 resultados
            </div>
          </div>

          <div className={styles.rightGroup}>
            <label className={styles.label}>
              Mostrar
              <input type="number" className={styles.inputSmall}  />
            </label>
            <label className={styles.label}>
              Ordenar por
              <select className={styles.select}>
                <option>Padrão</option>
                <option>Preço (menor)</option>
                <option>Preço (maior)</option>
                <option>Avaliação</option>
              </select>
            </label>
          </div>
        </div>

        {/* Produtos à direita */}
        <section className={styles.productsArea}>
          <div className={styles.productsList}>
            {paginatedProducts.map(product => (
              <div key={product.id} className={styles.card}>
                <img src={product.image} alt={product.title} className={styles.image} />
                <div className={styles.info}>
                  <h3>{product.title}</h3>
                  <p>⭐ {product.rating} • {product.location}</p>
                  <p className={styles.price}>R$ {product.price.toFixed(2)} <span>por {product.unit}</span></p>
                  <p className={styles.description}>{product.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} className={styles.pageButton}>Next</button>
          </div>
        </section>
      </main>

      {/* Informações extras */}
      <div className={styles.bottomInfo}>
        <div className={styles.feature}>
          <img src="https://img.icons8.com/ios-filled/50/000000/ok--v1.png" alt="Check" />
          <div>
            <strong>Dividir com Segurança</strong>
          </div>
        </div>
        <div className={styles.feature}>
          <img src="https://img.icons8.com/ios/50/headset--v1.png" alt="Headset" />
          <div>
            <strong>Comunicação Direta</strong><br />
            <span>Fornecedor &lt;--&gt; Vendedor</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
