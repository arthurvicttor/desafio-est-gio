import { useEffect, useState, useCallback } from "react";
import { AccountCard } from "../components/AccountCard";
import { api } from "../services/api";
import type { AccountResponse } from "../types";

export function Home() {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.findAll();
      setAccounts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAccounts();
  }, [loadAccounts]);

  if (loading) {
    return <p className="message">Carregando contas...</p>;
  }

  if (error) {
    return (
      <div className="message">
        <p className="error-message">Erro: {error}</p>
        <button onClick={loadAccounts}>Tentar novamente</button>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="message">
        <p>Nenhuma conta cadastrada.</p>
        <p>Crie uma conta para começar!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Contas</h2>

      <div className="account-list">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
