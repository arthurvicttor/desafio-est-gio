import { v4 as uuidv4 } from "uuid";
import { Account } from "../models/account";
import { CheckingAccount } from "../models/checking-account";
import { SavingsAccount } from "../models/savings-account";
import { AccountRepository } from "../repositories/account.repository";
import { AppError } from "../errors/app-error";
import {
  AccountType,
  CreateAccountDTO,
  WithdrawDTO,
  TransferDTO,
  DepositDTO,
  AccountResponse,
  WithdrawResponse,
  TransferResponse,
} from "../types";

export class AccountService {
  constructor(private repository: AccountRepository) {}

  createAccount(dto: CreateAccountDTO): AccountResponse {
    if (!dto.holder || dto.holder.trim().length === 0) {
      throw new AppError(
        400,
        "INVALID_HOLDER",
        "Nome do titular é obrigatório.",
      );
    }

    if (!Object.values(AccountType).includes(dto.type)) {
      throw new AppError(
        400,
        "INVALID_TYPE",
        'Tipo de conta inválido. Use "checking" ou "savings".',
      );
    }

    const id = uuidv4();
    const account = this.createAccountByType(id, dto.holder, dto.type);
    this.repository.save(account);

    return this.toResponse(account);
  }

  findAll(): AccountResponse[] {
    return this.repository.findAll().map(this.toResponse);
  }

  findById(id: string): AccountResponse {
    const account = this.getAccountOrThrow(id);
    return this.toResponse(account);
  }

  deposit(id: string, dto: DepositDTO): AccountResponse {
    if (!dto.amount || dto.amount <= 0) {
      throw new AppError(
        400,
        "INVALID_AMOUNT",
        "O valor do depósito deve ser positivo.",
      );
    }

    const account = this.getAccountOrThrow(id);
    account.deposit(dto.amount);
    this.repository.update(account);

    return this.toResponse(account);
  }

  withdraw(id: string, dto: WithdrawDTO): WithdrawResponse {
    if (!dto.amount || dto.amount <= 0) {
      throw new AppError(
        400,
        "INVALID_AMOUNT",
        "O valor do saque deve ser positivo.",
      );
    }

    const account = this.getAccountOrThrow(id);

    try {
      account.withdraw(dto.amount);
    } catch (error: any) {
      throw new AppError(422, "INSUFFICIENT_BALANCE", error.message);
    }

    this.repository.update(account);

    return {
      ...this.toResponse(account),
      fee: account.withdrawFee,
    };
  }

  transfer(id: string, dto: TransferDTO): TransferResponse {
    if (!dto.amount || dto.amount <= 0) {
      throw new AppError(
        400,
        "INVALID_AMOUNT",
        "O valor da transferência deve ser positivo.",
      );
    }

    if (id === dto.toAccountId) {
      throw new AppError(
        400,
        "SAME_ACCOUNT",
        "Não é possível transferir para a mesma conta.",
      );
    }

    const fromAccount = this.getAccountOrThrow(id);
    const toAccount = this.getAccountOrThrow(dto.toAccountId);

    const total = dto.amount + fromAccount.transferFee;

    try {
      fromAccount.withdraw(dto.amount);
    } catch (error: any) {
      throw new AppError(422, "INSUFFICIENT_BALANCE", error.message);
    }

    toAccount.deposit(dto.amount);

    this.repository.update(fromAccount);
    this.repository.update(toAccount);

    return {
      from: this.toResponse(fromAccount),
      to: this.toResponse(toAccount),
      amount: dto.amount,
      fee: fromAccount.transferFee,
    };
  }

  // Métodos privados

  private createAccountByType(
    id: string,
    holder: string,
    type: AccountType,
  ): Account {
    switch (type) {
      case AccountType.CHECKING:
        return new CheckingAccount(id, holder);
      case AccountType.SAVINGS:
        return new SavingsAccount(id, holder);
    }
  }

  private getAccountOrThrow(id: string): Account {
    const account = this.repository.findById(id);
    if (!account) {
      throw new AppError(404, "ACCOUNT_NOT_FOUND", "Conta não encontrada.");
    }
    return account;
  }

  private toResponse(account: Account): AccountResponse {
    return {
      id: account.id,
      holder: account.holder,
      type: account.type,
      balance: account.balance,
    };
  }
}
