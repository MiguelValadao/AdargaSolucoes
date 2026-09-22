import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Api, waLink } from "../api";
import type { Car } from "../types";
import CarCard from "../components/CarCard";
import LeadModal from "../components/LeadModal";
import WhatsAppFloat from "../components/WhatsAppFloat";

const SERVICES = [
  {
    icon: "🚗",
    title: "Venda de veículos para empresas",
    desc: "Oportunidades selecionadas de carros novos e seminovos, com avaliação de frota, negociação direta e documentação cuidada.",
  },
  {
    icon: "📋",
    title: "Consultoria descritiva automotiva",
    desc: "Análise detalhada do veículo: histórico, condições, tabela de referência e a melhor relação custo-benefício para o seu negócio.",
  },
  {
    icon: "📈",
    title: "Consórcios",
    desc: "Planejamento de aquisição via consórcio para empresas, com orientação sobre lances, contemplação e formação de frota.",
  },
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
            <span className="kicker" style={{ color: "var(--gold-500)" }}>
              Para empresas &amp; frotas
            </span>
            <h1>
              Carros para sua empresa, com <span>consultoria</span> de ponta a ponta.
            </h1>
            <p>
              A ADARGA Soluções atua no mercado automotivo e de consórcios oferecendo
              oportunidades de compra selecionadas, descritivo técnico completo e
              atendimento personalizado até a entrega das chaves.
            </p>
            <div className="hero-actions">
              <Link to="/catalogo" className="btn btn-gold">
                Ver catálogo
              </Link>
              <a
                className="btn btn-outline"
                href={waLink(whatsapp, "Olá, ADARGA Soluções! Quero falar com um consultor.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
          <div className="hero-stats">
            <div>
              <strong>100%</strong>
              <span>Veículos auditados</span>
            </div>
            <div>
              <strong>B2B</strong>
              <span>Foco em empresas</span>
            </div>
            <div>
              <strong>Frota</strong>
              <span>Compra assistida</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="servicos">
        <div className="container">
          <div className="section-title">
            <span className="kicker">O que fazemos</span>
            <h2>Serviços da ADARGA Soluções</h2>
            <p>Soluções completas para renovar e ampliar a frota do seu negócio.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <div className="service-card" key={s.title}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {destaque.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-title">
              <span className="kicker">Oportunidades</span>
              <h2>Destaques da semana</h2>
              <p>Veículos em destaque selecionados pela nossa equipe de consultores.</p>
            </div>
            <div className="cars-grid">
              {destaque.map((car) => (
                <CarCard key={car.id} car={car} onInterested={setSelected} />
              ))}
            </div>
            {outros.length > 0 && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Link to="/catalogo" className="btn btn-dark">
                  Ver todos os veículos
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="section lead-section" id="consultoria">
        <div className="container lead-grid">
          <div className="lead-info">
            <span className="kicker" style={{ color: "var(--gold-500)" }}>
              Consultoria gratuita
            </span>
            <h2>
              Deixe seus dados e receba a <span>melhor oportunidade</span> para sua empresa.
            </h2>
            <p>
              Nossa consultoria descritiva avalia o veículo, o mercado e o consórcio
              mais adequado ao seu perfil. Você recebe um relatório e seguimos o
              atendimento pelo WhatsApp.
            </p>
            <ul className="lead-points">
              <li>Descrição técnica completa do veículo</li>
              <li>Comparativo de mercado e melhor custo-benefício</li>
              <li>Orientação sobre consórcios e formação de frota</li>
              <li>Atendimento humanizado via WhatsApp</li>
            </ul>
          </div>
          <div className="form-card">
            <h3>Fale com um consultor</h3>
            <p className="form-sub">
              Preencha abaixo. Retornaremos em instantes pelo WhatsApp.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                try {
                  const data = await Api.createLead({
                    nome: String(f.get("nome") || ""),
                    email: String(f.get("email") || ""),
                    telefone: String(f.get("telefone") || ""),
                    mensagem: String(f.get("mensagem") || "") || "Quero consultoria para compra de veículo.",
                  });
                  window.open(
                    waLink(
                      data.whatsapp,
                      `Olá, ADARGA Soluções! Meu nome é ${f.get("nome")}.\nQuero uma consultoria para compra de veículo.\nE-mail: ${f.get("email")}\nTelefone: ${f.get("telefone")}`
                    ),
                    "_blank"
                  );
                  e.currentTarget.reset();
                  alert("Recebemos seus dados! O WhatsApp abrirá para o atendimento.");
                } catch (err: any) {
                  alert(err.response?.data?.error || "Não foi possível enviar.");
                }
              }}
            >
              <div className="form-group">
                <label>Nome completo *</label>
                <input className="form-control" name="nome" required placeholder="Seu nome" />
              </div>
              <div className="form-group">
                <label>E-mail corporativo *</label>
                <input className="form-control" type="email" name="email" required placeholder="voce@empresa.com.br" />
              </div>
              <div className="form-group">
                <label>WhatsApp *</label>
                <input className="form-control" type="tel" name="telefone" required placeholder="(11) 99999-9999" />
              </div>
              <div className="form-group">
                <label>Como podemos ajudar?</label>
                <textarea className="form-control" name="mensagem" placeholder="Ex.: renovar 5 veículos da frota, consórcio, etc." />
              </div>
              <button className="btn btn-gold" style={{ width: "100%" }}>
                Quero receber consultoria
              </button>
            </form>
          </div>
        </div>
      </section>

      {selected && (
        <LeadModal car={selected} onClose={() => setSelected(null)} />
      )}
      <WhatsAppFloat />
    </>
  );
}