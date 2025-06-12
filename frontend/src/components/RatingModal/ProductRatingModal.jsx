import React, { useState } from 'react';
import styles from './ProductRatingModal.module.css';

// Adicione a prop 'initialFeedback' para o caso de querer preencher o campo com algum texto inicial
const ProductRatingModal = ({ isOpen, onClose, onSubmit, initialFeedback = '' }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  // NOVO: Estado para o texto da avaliação
  const [feedback, setFeedback] = useState(initialFeedback);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOVO: onSubmit agora envia o rating E o feedback
    onSubmit({ rating, feedback });
    setRating(0);
    setHoverRating(0);
    setFeedback(''); // Reseta o feedback após o envio
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

          {/* NOVO: Seção para o campo de texto */}
          <div className={styles.feedbackSection}> {/* Reutiliza a classe feedbackSection do SupplierExperienceModal */}
            <p>Compartilhe sua experiência com o produto!</p>
            <textarea
              placeholder="Conte-nos mais sobre sua experiência com o produto..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className={styles.textarea} // Reutiliza a classe textarea
            ></textarea>
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