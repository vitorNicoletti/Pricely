import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h2 className={styles.footerTitle}>Pricely</h2>
          <address className={styles.footerAddress}>
            400 University Drive Suite 200 Coral Gables,
            <br />
            FL 33134 USA
          </address>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Links</h3>
          <ul>
            <li>
              <a onClick={() => navigate("/")}>Home</a>
            </li>
            <li>
              <a onClick={() => navigate("/about")}>Sobre</a>
            </li>
            <li>
              <a onClick={() => navigate("/contact")}>Fale Conosco</a>
            </li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Ajuda</h3>
          <ul>
            <li>
              <a onClick={() => navigate("/payment-options")}>Opções de Pagamento</a>
            </li>
            <li>
              <a onClick={() => navigate("/returns")}>Devoluções</a>
            </li>
            <li>
              <a onClick={() => navigate("/privacy-policy")}>Política de Privacidade</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
