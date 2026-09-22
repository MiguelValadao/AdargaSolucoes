import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api, waLink } from "../api";
import type { Car, CarInput, Lead } from "../types";
import { formatKm, formatPrice } from "../types";

const EMPTY: CarInput = {
  marca: "",
  modelo: "",
  ano: new Date().getFullYear(),
  quilometragem: null,
  combustivel: "",
  cambio: "",
  cor: "",
  preco: "",
  imagem_url: "",
  descricao: "",
  destaque: false,
  status: "disponivel",
};

const STATUS_CAR = ["disponivel", "reservado", "vendido"];
const STATUS_LEAD = ["novo", "contato", "negociando", "fechado", "arquivado"];

export default function Admin() {
  const [tab, setTab] = useState<"cars" | "leads">("cars");
  const [cars, setCars] = useState<Car[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<CarInput>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [admin, setAdmin] = useState<{ nome: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(() => {
    Api.listCars().then(setCars).catch(() => {});
    Api.listLeads().then(setLeads).catch(() => {});
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("adarga_admin");
    if (raw) setAdmin(JSON.parse(raw));
    load();
  }, [load]);

  const logout = async () => {
    await Api.signOut();
    localStorage.removeItem("adarga_admin");
    navigate("/admin/login");
  };

  const openNew = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (car: Car) => {
    setEditingId(car.id);
    setForm({
      marca: car.marca,
      modelo: car.modelo,
      ano: car.ano,
      quilometragem: car.quilometragem,
      combustivel: car.combustivel || "",
      cambio: car.cambio || "",
      cor: car.cor || "",
      preco: String(car.preco),
      imagem_url: car.imagem_url || "",
      descricao: car.descricao || "",
      destaque: car.destaque,
      status: car.status,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload: CarInput = {
        ...form,
        preco: Number(form.preco),
        quilometragem: form.quilometragem ? Number(form.quilometragem) : null,
        ano: Number(form.ano),
      };
      if (editingId) await Api.updateCar(editingId, payload);
      else await Api.createCar(payload);
      setMsg({ type: "ok", text: editingId ? "Veículo atualizado!" : "Veículo adicionado ao catálogo!" });
      setShowForm(false);
      load();
    } catch (err: any) {
      setMsg({ type: "err", text: err.response?.data?.error || "Erro ao salvar veículo." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (car: Car) => {
    if (!window.confirm(`Excluir ${car.marca} ${car.modelo}?`)) return;
    try {
      await Api.deleteCar(car.id);
      load();
    } catch {
      alert("Erro ao excluir.");
    }
  };

  const updateLead = async (lead: Lead, status: string) => {
    try {
      await Api.updateLeadStatus(lead.id, status);
      load();
    } catch {
      alert("Erro ao atualizar lead.");
    }
  };

  const removeLead = async (lead: Lead) => {
    if (!window.confirm(`Excluir lead de ${lead.nome}?`)) return;
    try {
      await Api.deleteLead(lead.id);
      load();
    } catch {
      alert("Erro ao excluir lead.");
    }
  };

  const set = (k: keyof CarInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value =
      e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await Api.uploadImage(file);
      setForm((f) => ({ ...f, imagem_url: url }));
    } catch {
      alert("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <strong>Painel ADARGA</strong>
            <span style={{ color: "#aab4c4", fontSize: 13 }}>
              {admin ? `Olá, ${admin.nome}` : ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="tab" onClick={logout}>
              Sair
            </button>
            <a href="/" style={{ color: "#cfd6e2", fontSize: 14 }}>
              Ver site →
            </a>
          </div>
        </div>
      </div>

      <div className="admin-topbar" style={{ background: "var(--navy-700)", padding: "12px 0" }}>
        <div className="container tabs">
          <button className={`tab ${tab === "cars" ? "active" : ""}`} onClick={() => setTab("cars")}>
            Veículos ({cars.length})
          </button>
          <button className={`tab ${tab === "leads" ? "active" : ""}`} onClick={() => setTab("leads")}>
            Leads ({leads.length})
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {tab === "cars" && (
            <>
              {showForm && (
                <form className="admin-form" onSubmit={save} style={{ marginBottom: 28 }}>
                  <h3 style={{ color: "var(--navy-900)", marginBottom: 16 }}>
                    {editingId ? "Editar veículo" : "Novo veículo no catálogo"}
                  </h3>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Marca *</label>
                      <input className="form-control" value={form.marca} onChange={set("marca")} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Modelo *</label>
                      <input className="form-control" value={form.modelo} onChange={set("modelo")} required />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Ano *</label>
                      <input className="form-control" type="number" value={form.ano} onChange={set("ano")} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Quilometragem</label>
                      <input className="form-control" type="number" value={form.quilometragem ?? ""} onChange={set("quilometragem")} placeholder="km" />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Combustível</label>
                      <input className="form-control" value={form.combustivel} onChange={set("combustivel")} placeholder="Flex, Diesel..." />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Câmbio</label>
                      <input className="form-control" value={form.cambio} onChange={set("cambio")} placeholder="Automático, Manual..." />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Cor</label>
                      <input className="form-control" value={form.cor} onChange={set("cor")} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Preço (R$) *</label>
                      <input className="form-control" type="number" step="0.01" value={form.preco} onChange={set("preco")} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Imagem do veículo</label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    {uploading && <p className="form-sub" style={{ marginTop: 4 }}>Enviando imagem...</p>}
                    {form.imagem_url && (
                      <img
                        src={form.imagem_url}
                        alt="Pré-visualização"
                        style={{ marginTop: 8, maxHeight: 160, borderRadius: 8, objectFit: "cover" }}
                      />
                    )}
                    {form.imagem_url && (
                      <button
                        type="button"
                        className="btn btn-dark"
                        style={{ marginTop: 6, padding: "6px 12px", fontSize: 13 }}
                        onClick={() => setForm((f) => ({ ...f, imagem_url: "" }))}
                      >
                        Remover imagem
                      </button>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea className="form-control" value={form.descricao} onChange={set("descricao")} placeholder="Descrição técnica do veículo..." />
                  </div>
                  <div className="form-row" style={{ marginBottom: 16 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Status</label>
                      <select className="form-control" value={form.status} onChange={set("status")}>
                        {STATUS_CAR.map((s) => (
                          <option key={s} value={s}>
                            {s === "disponivel" ? "Disponível" : s === "reservado" ? "Reservado" : "Vendido"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div
                      className="form-group"
                      style={{
                        marginBottom: 0,
                        display: "flex",
                        alignItems: "flex-end",
                        paddingBottom: 11,
                        gap: 8,
                      }}
                    >
                      <input type="checkbox" id="destaque" checked={form.destaque} onChange={set("destaque")} />
                      <label htmlFor="destaque" style={{ marginBottom: 0 }}>
                        Destacar na home
                      </label>
                    </div>
                  </div>
                  {msg && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-gold" disabled={saving}>
                      {saving ? "Salvando..." : "Salvar"}
                    </button>
                    <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {!showForm && (
                <div style={{ marginBottom: 22 }}>
                  <button className="btn btn-gold" onClick={openNew}>
                    + Adicionar veículo
                  </button>
                </div>
              )}

              {cars.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🚗</div>
                  <p>Nenhum veículo no catálogo. Adicione o primeiro agora!</p>
                </div>
              ) : (
                <div className="admin-grid">
                  {cars.map((car) => (
                    <div className="admin-car" key={car.id}>
                      <div className="admin-car-image">
                        {car.imagem_url ? (
                          <img src={car.imagem_url} alt={`${car.marca} ${car.modelo}`} />
                        ) : (
                          <div
                            className="placeholder"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#8d97a8", fontSize: 34 }}
                          >
                            🚗
                          </div>
                        )}
                      </div>
                      <div className="admin-car-body">
                        <h4>
                          {car.marca} {car.modelo} · {car.ano}
                        </h4>
                        <div className="price">{formatPrice(car.preco)}</div>
                        <div className="car-specs" style={{ marginTop: 8 }}>
                          {car.quilometragem !== null && <span>{formatKm(car.quilometragem)}</span>}
                          {car.combustivel && <span>{car.combustivel}</span>}
                          {car.cambio && <span>{car.cambio}</span>}
                          <span className={`car-status ${car.status}`}>
                            {car.status === "disponivel" ? "Disponível" : car.status === "reservado" ? "Reservado" : "Vendido"}
                          </span>
                        </div>
                        <div className="admin-actions">
                          <button className="btn btn-dark" onClick={() => openEdit(car)}>
                            Editar
                          </button>
                          <button className="btn btn-danger" onClick={() => remove(car)}>
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "leads" && (
            <>
              <p style={{ color: "var(--muted)", marginBottom: 18 }}>
                Clique no ícone de WhatsApp para abrir o atendimento direto com o lead.
              </p>
              {leads.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📭</div>
                  <p>Nenhum lead recebido ainda.</p>
                </div>
              ) : (
                <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                  {leads.map((lead) => (
                    <div className="lead-card" key={lead.id}>
                      <div className="lead-name">
                        <span>{lead.nome}</span>
                        <span className={`lead-status ${lead.status}`}>{lead.status}</span>
                      </div>
                      {lead.marca && (
                        <p className="muted">
                          Interesse: {lead.marca} {lead.modelo}
                          {lead.ano ? ` ${lead.ano}` : ""}
                        </p>
                      )}
                      <p className="muted">📧 {lead.email}</p>
                      <p className="muted">📱 {lead.telefone}</p>
                      {lead.mensagem && <p className="muted">💬 {lead.mensagem}</p>}
                      <p className="muted">
                        🕐 {new Date(lead.created_at).toLocaleString("pt-BR")}
                      </p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <select
                          className="form-control"
                          style={{ width: "auto", flex: 1 }}
                          value={lead.status}
                          onChange={(e) => updateLead(lead, e.target.value)}
                        >
                          {STATUS_LEAD.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <a
                          className="badge-whatsapp"
                          href={waLink(
                            lead.telefone.replace(/\D/g, ""),
                            `Olá ${lead.nome}, tudo bem? Aqui é da ADARGA Soluções. Recebemos seu interesse e gostaríamos de continuar o atendimento!`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                        <button className="btn btn-danger" style={{ padding: "8px 12px" }} onClick={() => removeLead(lead)}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}