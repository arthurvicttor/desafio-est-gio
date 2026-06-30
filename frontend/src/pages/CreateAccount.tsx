import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { AccountType } from "../types";

export function CreateAccount() {
  const navigate = useNavigate();

  const [holder, setHolder] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!holder.trim()) {
      setError("Nome do titular é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.createAccount({
        holder: holder.trim(),
        type,
      });

      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Criar Conta</h2>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="holder">Titular</label>

          <input
            id="holder"
            type="text"
            placeholder="Nome do titular"
            value={holder}
            onChange={(e) => {
              setHolder(e.target.value);
              setError(null);
            }}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo de Conta</label>

          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            disabled={loading}
          >
            <option value="checking">Conta Corrente</option>
            <option value="savings">Conta Poupança</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Conta"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
