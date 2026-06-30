import { useState, type FormEvent } from "react";

interface TransactionFormProps {
  type: "deposit" | "withdraw" | "transfer";
  onSubmit: (amount: number, toAccountId?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function TransactionForm({
  type,
  onSubmit,
  loading,
  error,
}: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const labels = {
    deposit: "Depositar",
    withdraw: "Sacar",
    transfer: "Transferir",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setLocalError("Informe um valor válido maior que zero.");
      return;
    }

    if (type === "transfer") {
      if (!toAccountId.trim()) {
        setLocalError("Informe o ID da conta destino.");
        return;
      }

      await onSubmit(value, toAccountId.trim());
    } else {
      await onSubmit(value);
    }

    setAmount("");
    setToAccountId("");
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h4>{labels[type]}</h4>

      {type === "transfer" && (
        <input
          type="text"
          placeholder="ID da conta destino"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
          disabled={loading}
        />
      )}

      <input
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Processando..." : labels[type]}
      </button>

      {(error || localError) && (
        <p className="error-message">{error || localError}</p>
      )}
    </form>
  );
}
