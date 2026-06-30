import { Account } from "./account";

export class CheckingAccount extends Account {
  get type(): string {
    return "checking";
  }

  get withdrawFee(): number {
    return 1.0;
  }

  get transferFee(): number {
    return 1.0;
  }

  get overdraftLimit(): number {
    return 500;
  }
}
