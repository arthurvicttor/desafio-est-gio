import { Account } from "../models/account";

export class AccountRepository {
  private accounts: Account[] = [];

  findById(id: string): Account | undefined {
    return this.accounts.find((account) => account.id === id);
  }

  findAll(): Account[] {
    return this.accounts;
  }

  save(account: Account): void {
    this.accounts.push(account);
  }

  update(account: Account): void {
    const index = this.accounts.findIndex((a) => a.id === account.id);
    if (index !== -1) {
      this.accounts[index] = account;
    }
  }
}
