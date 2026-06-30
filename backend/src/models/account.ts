export abstract class Account {
  id: string;
  holder: string;
  balance: number;

  constructor(id: string, holder: string, balance: number = 0) {
    this.id = id;
    this.holder = holder;
    this.balance = balance;
  }

  abstract get type(): string;
  abstract get withdrawFee(): number;
  abstract get transferFee(): number;
  abstract get overdraftLimit(): number;

  withdraw(amount: number): void {
    const total = amount + this.withdrawFee;

    if (this.balance - total < -this.overdraftLimit) {
      throw new Error("Saldo insuficiente");
    }

    this.balance -= total;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }
}
