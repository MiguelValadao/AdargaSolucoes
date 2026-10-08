import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api, waLink } from "../api";
import type { Car } from "../types";
import CarCard from "../components/CarCard";
import LeadModal from "../components/LeadModal";
import WhatsAppFloat from "../components/WhatsAppFloat";

const SERVICES = [
  { icon: "🚗", title: "Veículos para empresas", desc: "Oportunidades selecionadas de carros novos e seminovos, com avaliação de frota, negociação direta e documentação cuidada." },
  { icon: "▤", title: "Consultoria automotiva", desc: "Análise completa de histórico, condições, referências de mercado e melhor relação custo-benefício para o seu negócio." },
  { icon: "↗", title: "Consórcios", desc: "Planejamento de aquisição para empresas, com orientação sobre lances, contemplação e formação de frota." },
];

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [whatsapp, setWhatsapp] = useState("5511999999999");
  const [selected, setSelected] = useState<Car | null>(null);

  useEffect(() => {
    Api.listCars().then((data) => setCars(data.filter((c) => c.status === "disponivel"))).catch(() => {});
    Api.getSettings().then((s) => setWhatsapp(s.whatsapp)).catch(() => {});
  }, []);

  const destaque = cars.filter((c) => c.destaque).slice(0, 3);
  const outros = cars.filter((c) => !c.destaque).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="kicker">Para empresas &amp; frotas</span>
            <h1>Carros para sua empresa, com <span>consultoria</span> de ponta a ponta.</h1>
            <p>A ADARGA Soluções une oportunidades selecionadas, descrição técnica completa e atendimento personalizado até a entrega das chaves.</p>
            <div className="hero-actions">
              <Link to="/catalogo" className="btn btn-gold">Ver catálogo</Link>
              <a className="btn btn-outline" href={waLink(whatsapp, "Olá, ADARGA Soluções! Quero falar com um consultor.")} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
            </div>
          </div>
          <div className="hero-stats" aria-label="Diferenciais da ADARGA">
            <div><strong>100%</strong><span>Veículos auditados</span></div>
            <div><strong>B2B</strong><span>Foco em empresas</span></div>
            <div><strong>Frota</strong><span>Compra assistida</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="servicos">
        <div className="container">
          <div className="section-title"><span className="kicker">O que fazemos</span><h2>Soluções para decisões mais seguras</h2><p>Da compra pontual à renovação de frota, organizamos cada etapa para a sua empresa.</p></div>
          <div className="services-grid">{SERVICES.map((service) => <article className="service-card" key={service.title}><div className="service-icon">{service.icon}</div><h3>{service.title}</h3><p>{service.desc}</p></article>)}</div>
        </div>
      </section>

      {destaque.length > 0 && <section className="section section-alt">
        <div className="container">
          <div className="section-title"><span className="kicker">Oportunidades</span><h2>Destaques da semana</h2><p>Veículos selecionados pela nossa equipe de consultores.</p></div>
          <div className="cars-grid">{destaque.map((car) => <CarCard key={car.id} car={car} onInterested={setSelected} />)}</div>
          {outros.length > 0 && <div style={{ textAlign: "center", marginTop: 34 }}><Link to="/catalogo" className="btn btn-dark">Ver todos os veículos</Link></div>}
        </div>
      </section>}

      <section className="section lead-section" id="consultoria">
        <div className="container lead-grid">
          <div className="lead-info">
            <span className="kicker" style={{ color: "var(--gold-500)" }}>Consultoria gratuita</span>
            <h2>Deixe seus dados e receba a <span>melhor oportunidade</span> para sua empresa.</h2>
            <p>Nossa consultoria avalia o veículo, o mercado e o consórcio mais adequado ao seu perfil. Você recebe orientação clara e seguimos o atendimento pelo WhatsApp.</p>
            <ul className="lead-points"><li>Descrição técnica completa do veículo</li><li>Comparativo de mercado e custo-benefício</li><li>Orientação sobre consórcios e formação de frota</li><li>Atendimento humanizado via WhatsApp</li></ul>
          </div>
          <ConsultancyForm />
        </div>
      </section>
      {selected && <LeadModal car={selected} onClose={() => setSelected(null)} />}
      <WhatsAppFloat />
    </>
  );
}

export function ConsultancyForm() {
  return <div className="form-card">
    <h3>Fale com um consultor</h3><p className="form-sub">Preencha abaixo. Retornaremos em instantes pelo WhatsApp.</p>
    <form onSubmit={async (e) => {
      e.preventDefault(); const form = new FormData(e.currentTarget);
      try {
        const data = await Api.createLead({ nome: String(form.get("nome") || ""), email: String(form.get("email") || ""), telefone: String(form.get("telefone") || ""), mensagem: String(form.get("mensagem") || "") || "Quero consultoria para compra de veículo." });
        window.open(waLink(data.whatsapp, `Olá, ADARGA Soluções! Meu nome é ${form.get("nome")}.
Quero uma consultoria para compra de veículo.
E-mail: ${form.get("email")}
Telefone: ${form.get("telefone")}`), "_blank");
        e.currentTarget.reset(); alert("Recebemos seus dados! O WhatsApp abrirá para o atendimento.");
      } catch (err: any) { alert(err.response?.data?.error || "Não foi possível enviar."); }
    }}>
      <div className="form-group"><label>Nome completo *</label><input className="form-control" name="nome" required placeholder="Seu nome" /></div>
      <div className="form-group"><label>E-mail corporativo *</label><input className="form-control" type="email" name="email" required placeholder="voce@empresa.com.br" /></div>
      <div className="form-group"><label>WhatsApp *</label><input className="form-control" type="tel" name="telefone" required placeholder="(11) 99999-9999" /></div>
      <div className="form-group"><label>Como podemos ajudar?</label><textarea className="form-control" name="mensagem" placeholder="Ex.: renovar 5 veículos da frota, consórcio, etc." /></div>
      <button className="btn btn-gold" style={{ width: "100%" }}>Quero receber consultoria</button>
    </form>
  </div>;
}
