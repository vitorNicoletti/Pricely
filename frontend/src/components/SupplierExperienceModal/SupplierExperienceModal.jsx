import React, { useState } from 'react';
import styles from './SupplierExperienceModal.module.css';

const SupplierExperienceModal = ({ isOpen, onClose, onSubmit }) => {
  // Alterado: Agora usamos 'rating' e 'hoverRating' para as estrelas
  const [rating, setRating] = useState(0); // O valor da avaliação que foi selecionado
  const [hoverRating, setHoverRating] = useState(0); // O valor da avaliação indicado pelo mouse (hover)
  const [feedback, setFeedback] = useState(''); // O campo de texto para feedback continua

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Alterado: onSubmit agora envia o rating e o feedback
    onSubmit({ rating, feedback });
    setRating(0); // Reseta o rating
    setHoverRating(0); // Reseta o hoverRating
    setFeedback(''); // Reseta o feedback
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Como foi a sua experiência com o Fornecedor?</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nova seção para a avaliação por estrelas */}
          <div className={styles.ratingSection}>
            <p>Avalie o Fornecedor!</p>
            <p>De 1 a 5 estrelas.</p>
            <div
              className={styles.starsContainer}
              onMouseLeave={() => setHoverRating(0)} // Reseta hover ao sair do container
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
                  &#9733; {/* Caractere Unicode para uma estrela */}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.feedbackSection}>
            <p>Compartilhe sua experiência!</p>
            <textarea
              placeholder="Exemplo: Atencioso, responde rápido"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className={styles.textarea}
            ></textarea>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierExperienceModal;