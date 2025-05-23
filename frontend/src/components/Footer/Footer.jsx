import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h2 className="footer-title">Pricely</h2>
          <address className="footer-address">
            400 University Drive Suite 200 Coral Gables,<br />
            FL 33134 USA
          </address>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Fale Conosco</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Ajuda</h3>
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
