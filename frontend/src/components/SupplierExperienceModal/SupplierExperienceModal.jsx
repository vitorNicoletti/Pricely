import React, { useState } from 'react';
import styles from './SupplierExperienceModal.module.css';

const SupplierExperienceModal = ({ isOpen, onClose, onSubmit }) => {
  const [recommend, setRecommend] = useState(null);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ recommend, feedback });
    setRecommend(null);
    setFeedback('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Como foi a sua experiência com o Fornecedor?</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.recommendationSection}>
            <p>Você recomenda esse Fornecedor?</p>
            <div className={styles.thumbsContainer}>
              <button
                type="button"
                className={`${styles.thumbButton} ${recommend === true ? styles.active : ''}`}
                onClick={() => setRecommend(true)}
              >
                👍
              </button>
              <button
                type="button"
                className={`${styles.thumbButton} ${recommend === false ? styles.active : ''}`}
                onClick={() => setRecommend(false)}
              >
                👎
              </button>
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