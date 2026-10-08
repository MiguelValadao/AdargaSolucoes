import { useEffect, useMemo, useState } from "react";
import { Api } from "../api";
import type { Car } from "../types";
import CarCard from "../components/CarCard";
import LeadModal from "../components/LeadModal";
import WhatsAppFloat from "../components/WhatsAppFloat";

const COMBUSTIVEIS = ["Flex", "Gasolina", "Etanol", "Diesel", "Híbrido", "Elétrico"];

export default function Catalogo() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Car | null>(null);
  const [filtro, setFiltro] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [ordenar, setOrdenar] = useState("recentes");

  useEffect(() => { Api.listCars().then(setCars).catch(() => setCars([])).finally(() => setLoading(false)); }, []);

  const filtrados = useMemo(() => {
    let list = cars.filter((c) => c.status === "disponivel");
    if (filtro.trim()) {
      const q = filtro.trim().toLowerCase();
      list = list.filter((c) => c.marca.toLowerCase().includes(q) || c.modelo.toLowerCase().includes(q) || `${c.marca} ${c.modelo}`.toLowerCase().includes(q));
    }
    if (combustivel) list = list.filter((c) => c.combustivel === combustivel);
    if (ordenar === "menor") list = [...list].sort((a, b) => Number(a.preco) - Number(b.preco));
    if (ordenar === "maior") list = [...list].sort((a, b) => Number(b.preco) - Number(a.preco));
    if (ordenar === "recentes") list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return list;
  }, [cars, filtro, combustivel, ordenar]);

  return (
    <>
      <section className="hero hero-compact"><div className="container"><span className="kicker hero-kicker">Catálogo</span><h1>Veículos selecionados para sua empresa</h1><p>Uma seleção criteriosa para tornar a próxima decisão da sua frota mais simples e segura.</p></div></section>
      <section className="section catalog-section"><div className="container">
        <div className="catalog-toolbar" aria-label="Filtros do catálogo">
          <input className="form-control" placeholder="Buscar marca ou modelo..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
          <select className="form-control" value={combustivel} onChange={(e) => setCombustivel(e.target.value)}><option value="">Todos os combustíveis</option>{COMBUSTIVEIS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <select className="form-control" value={ordenar} onChange={(e) => setOrdenar(e.target.value)}><option value="recentes">Mais recentes</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option></select>
        </div>
        {loading ? <div className="empty">Carregando veículos...</div> : filtrados.length === 0 ? <div className="empty"><div className="empty-icon">⌕</div><p>Nenhum veículo encontrado com esses filtros.</p><p className="empty-detail">Fale conosco no WhatsApp — temos oportunidades novas toda semana.</p></div> : <><p className="catalog-result-count">{filtrados.length} veículo{filtrados.length > 1 ? "s" : ""} disponível{filtrados.length > 1 ? "is" : ""}</p><div className="cars-grid">{filtrados.map((car) => <CarCard key={car.id} car={car} onInterested={setSelected} />)}</div></>}
      </div></section>
      {selected && <LeadModal car={selected} onClose={() => setSelected(null)} />}
      <WhatsAppFloat />
    </>
  );
}
