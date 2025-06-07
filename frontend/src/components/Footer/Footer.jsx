import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h2 className={styles.footerTitle}>Pricely</h2>
          <address className={styles.footerAddress}>
            400 University Drive Suite 200 Coral Gables,<br />
            FL 33134 USA
          </address>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Fale Conosco</a></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Ajuda</h3>
          <ul>
            <li><a href="#">Opções de Pagamento</a></li>
            <li><a href="#">Devoluções</a></li>
            <li><a href="#">Política de Privacidade</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
