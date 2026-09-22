export interface Car {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  quilometragem: number | null;
  combustivel: string | null;
  cambio: string | null;
  cor: string | null;
  preco: number | string;
  imagem_url: string | null;
  descricao: string | null;
  destaque: boolean;
  status: "disponivel" | "reservado" | "vendido";
  created_at: string;
}

export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string | null;
  status: string;
  created_at: string;
  marca: string | null;
  modelo: string | null;
  ano: number | null;
}

export interface CarInput {
  marca: string;
  modelo: string;
  ano: number;
  quilometragem: number | null;
  combustivel: string;
  cambio: string;
  cor: string;
  preco: number | string;
  imagem_url: string;
  descricao: string;
  destaque: boolean;
  status: string;
}

export interface LeadInput {
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  carro_id?: number | null;
}

export function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "R$ 0";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatKm(value: number | null): string {
  if (value === null || value === undefined) return "";
  return `${value.toLocaleString("pt-BR")} km`;
}