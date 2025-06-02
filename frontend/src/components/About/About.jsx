import "./About.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function About() {
  return (
    <>
    <Header />
    <section className="about">
      <div className="about-container">
        <h1 className="about-title">Sobre Nós</h1>
        <p className="about-text">
          Conectar pessoas para facilitar negócios — essa é a nossa missão.
        </p>
        <p className="about-text">
          Nosso site foi criado para tornar mais simples e eficiente a comunicação entre{" "}
          <strong>fornecedores e vendedores</strong>. Sabemos que muitos empreendedores enfrentam
          dificuldades ao buscar parceiros de confiança, negociar pedidos mínimos e encontrar os melhores
          produtos para revenda. É por isso que oferecemos uma plataforma prática, intuitiva e segura, onde
          todos podem se conectar com facilidade.
        </p>
        <p className="about-text">
          Além disso, trazemos uma funcionalidade exclusiva: <strong>rachar produtos</strong>. Com ela,
          é possível dividir a compra de itens com valor mínimo entre várias pessoas, facilitando o acesso
          a mercadorias de qualidade com menor investimento inicial. Ideal para quem está começando,
          testando novos produtos ou deseja reduzir riscos.
        </p>
        <p className="about-text">
          Nossa plataforma é o ponto de encontro para quem quer crescer no comércio com colaboração,
          transparência e oportunidade.
        </p>
      </div>
    </section>
    <Footer />
    </>
  );
}

export default About;
