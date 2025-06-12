import React, { useState } from 'react';
import styles from './ProductRatingModal.module.css';

const ProductRatingModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rating);
    setRating(0);
    setHoverRating(0);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Avalie sua Compra!</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.ratingSection}>
            <p>Você recomendaria esse produto para outros usuários?</p>
            <p>Avalie de 1-5 estrelas!</p>
            <div
              className={styles.starsContainer}
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${
                    star <= rating ? styles.selected : ''
                  } ${
                    star <= hoverRating && hoverRating > 0 ? styles.hoverActive : ''
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductRatingModal;