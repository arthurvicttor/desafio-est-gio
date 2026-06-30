import { Link } from "react-router-dom";
import type { AccountResponse } from "../types";

interface AccountCardProps {
  account: AccountResponse;
}

export function AccountCard({ account }: AccountCardProps) {
  const typeLabel =
    account.type === "checking" ? "Conta Corrente" : "Conta Poupança";

  const icon = account.type === "checking" ? "💳" : "💰";

  const balanceClass =
    account.balance > 0
      ? "balance-positive"
      : account.balance < 0
        ? "balance-negative"
        : "balance-neutral";

  return (
    <Link to={`/account/${account.id}`} className="account-card">
      <div className="account-card-header">
        <div>
          <p className="account-card-balance-label">Titular</p>
          <h3>{account.holder}</h3>
        </div>

        <span className="account-card-icon">{icon}</span>
      </div>

      <span className={`badge ${account.type}`}>{typeLabel}</span>

      <div className="card-divider" />

      <p className="account-card-balance-label">Saldo Disponível</p>

      <p className={`account-card-balance ${balanceClass}`}>
        R$ {account.balance.toFixed(2)}
      </p>

      <div className="card-arrow">→</div>
    </Link>
  );
}
