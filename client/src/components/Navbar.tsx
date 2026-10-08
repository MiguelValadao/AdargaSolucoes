import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src="/images/Logo.png" alt="ADARGA Soluções" className="brand-logo" />
          <span><small>SOLUÇÕES</small></span>
        </Link>
        <button type="button" className="menu-toggle" aria-label={isOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links ${isOpen ? "is-open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Início</Link>
          <Link to="/catalogo" onClick={closeMenu}>Catálogo</Link>
          <Link to="/#servicos" onClick={closeMenu}>Serviços</Link>
          <Link to="/#consultoria" onClick={closeMenu}>Consultoria</Link>
          <Link to="/sobre" onClick={closeMenu}>Sobre nós</Link>
        </div>
        <div className="nav-cta">
          <Link to="/catalogo" className="btn btn-gold" onClick={closeMenu}>Ver carros</Link>
        </div>
      </div>
    </nav>
  );
}
