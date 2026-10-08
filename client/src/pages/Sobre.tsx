import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api, waLink } from "../api";
import type { Car } from "../types";
import CarCard from "../components/CarCard";
import LeadModal from "../components/LeadModal";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { ConsultancyForm } from "./Home";

const VALUES = [
  { image: "/images/Foto1.jpg", title: "Transparência total", text: "Informações claras sobre histórico, condições e preços. Sem surpresas, sem letras miúdas." },
  { image: "/images/Foto2.jpg", title: "Expertise técnica", text: "Análise completa feita por especialistas que conhecem o mercado automotivo corporativo." },
  { image: "/images/Foto3.jpg", title: "Parceria de longo prazo", text: "Acompanhamos sua frota do planejamento à entrega, com suporte contínuo via WhatsApp." },
];

export default function Sobre() {
  const [cars, setCars] = useState<Car[]>([]);
  const [whatsapp, setWhatsapp] = useState("5511999999999");
  const [selected, setSelected] = useState<Car | null>(null);
  useEffect(() => { Api.listCars().then((data) => setCars(data.filter((c) => c.status === "disponivel"))).catch(() => {}); Api.getSettings().then((s) => setWhatsapp(s.whatsapp)).catch(() => {}); }, []);
  const destaque = cars.filter((c) => c.destaque).slice(0, 3);

  return <>
    <section className="hero"><div className="container hero-grid"><div><span className="kicker">A ADARGA Soluções</span><h1>Escolhas mais claras para uma <span>frota melhor.</span></h1><p>Combinamos atenção aos detalhes, conhecimento de mercado e uma relação próxima para tornar cada negociação mais tranquila.</p><div className="hero-actions"><Link to="/catalogo" className="btn btn-gold">Ver catálogo</Link><a className="btn btn-outline" href={waLink(whatsapp, "Olá, ADARGA Soluções! Quero falar com um consultor.")} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a></div></div><div className="hero-stats"><div><strong>100%</strong><span>Veículos auditados</span></div><div><strong>B2B</strong><span>Foco em empresas</span></div><div><strong>Frota</strong><span>Compra assistida</span></div></div></div></section>
    <section className="section" id="valores"><div className="container"><div className="section-title"><span className="kicker">Nossos valores</span><h2>O que nos move</h2><p>Três pilares que guiam cada negociação e atendimento.</p></div><div className="values-alternating">{VALUES.map((value, index) => <article className={`value-row ${index % 2 ? "value-row--image-right" : ""}`} key={value.title}><div className="value-image-larger"><img src={value.image} alt={value.title} /></div><div className="value-content"><h3>{value.title}</h3><p>{value.text}</p></div></article>)}</div></div></section>
    {destaque.length > 0 && <section className="section section-alt"><div className="container"><div className="section-title"><span className="kicker">Oportunidades</span><h2>Destaques da semana</h2><p>Veículos em destaque selecionados pela nossa equipe de consultores.</p></div><div className="cars-grid">{destaque.map((car) => <CarCard key={car.id} car={car} onInterested={setSelected} />)}</div></div></section>}
    <section className="section lead-section" id="consultoria"><div className="container lead-grid"><div className="lead-info"><span className="kicker" style={{ color: "var(--gold-500)" }}>Consultoria gratuita</span><h2>A melhor decisão começa com uma <span>boa conversa.</span></h2><p>Conte o que sua empresa procura. Nós analisamos as alternativas e orientamos os próximos passos.</p><ul className="lead-points"><li>Descrição técnica completa do veículo</li><li>Comparativo de mercado e custo-benefício</li><li>Orientação sobre consórcios e formação de frota</li><li>Atendimento humanizado via WhatsApp</li></ul></div><ConsultancyForm /></div></section>
    {selected && <LeadModal car={selected} onClose={() => setSelected(null)} />}<WhatsAppFloat />
  </>;
}
