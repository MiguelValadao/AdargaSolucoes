import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await Api.login(email, senha);
      localStorage.setItem("adarga_admin", JSON.stringify(data.admin));
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Falha no login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <h2>Painel ADARGA</h2>
        <p className="form-sub">Acesso restrito ao administrador</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>E-mail</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@adarga.com.br"
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              className="form-control"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="form-msg err">{error}</p>}
          <button className="btn btn-gold" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
