// Tipos e interfaces para o sistema bancário
export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
}

// DTO para criação de conta
export interface CreateAccountDTO {
  holder: string;
  type: AccountType;
}

// DTO para saque
export interface WithdrawDTO {
  amount: number;
}

// DTO para transferência
export interface TransferDTO {
  toAccountId: string;
  amount: number;
}

// DTO para depósito
export interface DepositDTO {
  amount: number;
}

// Resposta padronizada de conta
export interface AccountResponse {
  id: string;
  holder: string;
  type: string;
  balance: number;
}

// Resposta de saque
export interface WithdrawResponse extends AccountResponse {
  fee: number;
}

export interface TransferResponse {
  from: AccountResponse;
  to: AccountResponse;
  amount: number;
  fee: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
