import type {
  AccountResponse,
  CreateAccountDTO,
  TransactionDTO,
  TransferDTO,
  WithdrawResponse,
  TransferResponse,
  ErrorResponse,
} from "../types";

const BASE_URL = "http://localhost:3000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.error?.message || "Erro desconhecido");
  }

  return data as T;
}

export const api = {
  createAccount: (dto: CreateAccountDTO) =>
    request<AccountResponse>("/accounts", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  findAll: () => request<AccountResponse[]>("/accounts"),

  findById: (id: string) => request<AccountResponse>(`/accounts/${id}`),

  deposit: (id: string, dto: TransactionDTO) =>
    request<AccountResponse>(`/accounts/${id}/deposit`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  withdraw: (id: string, dto: TransactionDTO) =>
    request<WithdrawResponse>(`/accounts/${id}/withdraw`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  transfer: (id: string, dto: TransferDTO) =>
    request<TransferResponse>(`/accounts/${id}/transfer`, {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};
