import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <img src="/images/Logo.png" alt="ADARGA Soluções" className="brand-logo" />
          <span>
            <small>SOLUÇÕES</small>
          </span>
        </Link>
        <div className="nav-links">
          <Link to="/">Início</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/#servicos">Serviços</Link>
          <Link to="/#consultoria">Consultoria</Link>
          <Link to="/sobre">Sobre nós</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/catalogo" className="btn btn-gold">
            Ver carros
          </Link>
        </div>
      </div>
    </nav>
  );
}