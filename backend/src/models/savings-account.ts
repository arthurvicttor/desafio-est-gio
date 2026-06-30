import { Account } from "./account";

export class SavingsAccount extends Account {
  get type(): string {
    return "savings";
  }

  get withdrawFee(): number {
    return 0;
  }

  get transferFee(): number {
    return 0;
  }

  get overdraftLimit(): number {
    return 0;
  }
}
