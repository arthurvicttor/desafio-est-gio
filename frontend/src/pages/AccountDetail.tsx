import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TransactionForm } from "../components/TransactionForm";
import { api } from "../services/api";
import type { AccountResponse } from "../types";

export function AccountDetail() {
  const { id } = useParams<{ id: string }>();

  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="message">
        <p>ID inválido.</p>
        <Link to="/" className="btn-link">
          Voltar
        </Link>
      </div>
    );
  }

  const loadAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.findById(id);
      setAccount(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeposit = async (amount: number) => {
    try {
      setOperationLoading(true);
      setOperationError(null);

      const updated = await api.deposit(id, { amount });
      setAccount(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";

      setOperationError(message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      setOperationLoading(true);
      setOperationError(null);

      const updated = await api.withdraw(id, { amount });
      setAccount(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";

      setOperationError(message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleTransfer = async (amount: number, toAccountId?: string) => {
    if (!toAccountId) {
      setOperationError("Conta destino obrigatória");
      return;
    }

    try {
      setOperationLoading(true);
      setOperationError(null);

      const result = await api.transfer(id, {
        toAccountId,
        amount,
      });

      setAccount(result.from);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";

      setOperationError(message);
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) return <p className="message">Carregando conta...</p>;

  if (error) {
    return (
      <div className="message">
        <p className="error-message">Erro: {error}</p>
        <Link to="/" className="btn-link">
          Voltar para contas
        </Link>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="message">
        <p>Conta não encontrada.</p>
        <Link to="/" className="btn-link">
          Voltar para contas
        </Link>
      </div>
    );
  }

  const typeLabel =
    account.type === "checking" ? "Conta Corrente" : "Conta Poupança";

  return (
    <div>
      <Link to="/" className="btn-link">
        Voltar
      </Link>

      <div className="account-detail">
        <h2>{account.holder}</h2>

        <span className={`badge ${account.type}`}>{typeLabel}</span>

        <p className="balance">Saldo: R$ {account.balance.toFixed(2)}</p>
      </div>

      <div className="operations">
        <TransactionForm
          type="deposit"
          onSubmit={handleDeposit}
          loading={operationLoading}
          error={operationError}
        />

        <TransactionForm
          type="withdraw"
          onSubmit={handleWithdraw}
          loading={operationLoading}
          error={operationError}
        />

        <TransactionForm
          type="transfer"
          onSubmit={handleTransfer}
          loading={operationLoading}
          error={operationError}
        />
      </div>
    </div>
  );
}
