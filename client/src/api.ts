import { supabase } from "./lib/supabase";
import type { Car, CarInput, Lead, LeadInput } from "./types";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5511999999999";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@adarga.com.br";

export const Api = {
  getSettings: async () => {
    return { whatsapp: WHATSAPP_NUMBER };
  },

  listCars: async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("destaque", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Car[];
  },

  createCar: async (car: CarInput) => {
    const { data, error } = await supabase
      .from("cars")
      .insert({
        marca: car.marca,
        modelo: car.modelo,
        ano: car.ano,
        quilometragem: car.quilometragem,
        combustivel: car.combustivel || null,
        cambio: car.cambio || null,
        cor: car.cor || null,
        preco: car.preco,
        imagem_url: car.imagem_url || null,
        descricao: car.descricao || null,
        destaque: car.destaque,
        status: car.status,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Car;
  },

  updateCar: async (id: number, car: CarInput) => {
    const { data, error } = await supabase
      .from("cars")
      .update({
        marca: car.marca,
        modelo: car.modelo,
        ano: car.ano,
        quilometragem: car.quilometragem,
        combustivel: car.combustivel || null,
        cambio: car.cambio || null,
        cor: car.cor || null,
        preco: car.preco,
        imagem_url: car.imagem_url || null,
        descricao: car.descricao || null,
        destaque: car.destaque,
        status: car.status,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Car;
  },

  deleteCar: async (id: number) => {
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) throw error;
  },

  createLead: async (lead: LeadInput) => {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        nome: lead.nome,
        email: lead.email,
        telefone: lead.telefone,
        mensagem: lead.mensagem || null,
        carro_id: lead.carro_id || null,
      })
      .select("id, nome, created_at")
      .single();
    if (error) throw error;
    return { lead: data, whatsapp: WHATSAPP_NUMBER };
  },

  listLeads: async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*, cars!leads_carro_id_fkey(marca, modelo, ano)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((l: any) => ({
      id: l.id,
      nome: l.nome,
      email: l.email,
      telefone: l.telefone,
      mensagem: l.mensagem,
      status: l.status,
      created_at: l.created_at,
      marca: l.cars?.marca || null,
      modelo: l.cars?.modelo || null,
      ano: l.cars?.ano || null,
    })) as Lead[];
  },

  updateLeadStatus: async (id: number, status: string) => {
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .single();
    if (error) throw error;
    return data as { id: number; status: string };
  },

  deleteLead: async (id: number) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) throw error;
  },

  uploadImage: async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("car-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("car-images").getPublicUrl(path);
    return data.publicUrl;
  },

  login: async (email: string, senha: string) => {
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("Acesso não autorizado.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) throw error;
    return {
      token: data.session.access_token,
      admin: {
        id: Number(data.user.id.replace(/-/g, "").slice(0, 8)),
        nome: data.user.user_metadata?.nome || data.user.email || "",
        email: data.user.email || "",
      },
    };
  },

  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
};

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}
