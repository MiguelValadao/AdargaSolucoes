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

  useEffect(() => {
    Api.listCars()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    let list = cars.filter((c) => c.status === "disponivel");
    if (filtro.trim()) {
      const q = filtro.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.marca.toLowerCase().includes(q) ||
          c.modelo.toLowerCase().includes(q) ||
          `${c.marca} ${c.modelo}`.toLowerCase().includes(q)
      );
    }
    if (combustivel) list = list.filter((c) => c.combustivel === combustivel);
    switch (ordenar) {
      case "menor":
        list = [...list].sort((a, b) => Number(a.preco) - Number(b.preco));
        break;
      case "maior":
        list = [...list].sort((a, b) => Number(b.preco) - Number(a.preco));
        break;
      case "recentes":
      default:
        list = [...list].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    return list;
  }, [cars, filtro, combustivel, ordenar]);

  return (
    <>
      <section className="hero" style={{ padding: "56px 0" }}>
        <div className="container">
          <span className="kicker" style={{ color: "var(--gold-500)" }}>
            Catálogo
          </span>
          <h1 style={{ fontSize: 34 }}>Veículos disponíveis para sua empresa</h1>
          <p style={{ maxWidth: 640 }}>
            Todos os veículos passam por auditoria e consultoria descritiva da
            equipe ADARGA antes de chegar até você.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
              marginBottom: 28,
            }}
          >
            <input
              className="form-control"
              placeholder="Buscar marca ou modelo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <select
              className="form-control"
              value={combustivel}
              onChange={(e) => setCombustivel(e.target.value)}
            >
              <option value="">Todos os combustíveis</option>
              {COMBUSTIVEIS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="form-control"
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </div>

          {loading ? (
            <div className="empty">Carregando veículos...</div>
          ) : filtrados.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <p>Nenhum veículo encontrado com esses filtros.</p>
              <p style={{ marginTop: 8 }}>
                Fale conosco no WhatsApp — temos oportunidades novas toda semana.
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: "var(--muted)", marginBottom: 18 }}>
                {filtrados.length} veículo{filtrados.length > 1 ? "s" : ""} disponível
                {filtrados.length > 1 ? "is" : ""}
              </p>
              <div className="cars-grid">
                {filtrados.map((car) => (
                  <CarCard key={car.id} car={car} onInterested={setSelected} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selected && (
        <LeadModal car={selected} onClose={() => setSelected(null)} />
      )}
      <WhatsAppFloat />
    </>
  );
}