export type AccountType = "checking" | "savings";

export interface AccountResponse {
  id: string;
  holder: string;
  type: string;
  balance: number;
}

export interface WithdrawResponse extends AccountResponse {
  fee: number;
}

export interface TransferResponse {
  from: AccountResponse;
  to: AccountResponse;
  amount: number;
  fee: number;
}

export interface CreateAccountDTO {
  holder: string;
  type: AccountType;
}

export interface TransactionDTO {
  amount: number;
}

export interface TransferDTO {
  toAccountId: string;
  amount: number;
}

export interface DepositDTO {
  amount: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
