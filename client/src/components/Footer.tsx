import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>ADARGA Soluções</h4>
            <p>
              Consultoria e venda de veículos para empresas. Atuamos no mercado
              automotivo, com frota, consórcios e compra assistida.
            </p>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>
              <li>
                <Link to="/">Início</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo de veículos</Link>
              </li>
              <li>
                <Link to="/#consultoria">Consultoria</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Atendimento</h4>
            <ul>
              <li>Segunda a sexta, 9h às 18h</li>
              <li>Atendimento via WhatsApp</li>
              <li>Oportunidades para empresas e frotas</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} ADARGA Soluções — Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}