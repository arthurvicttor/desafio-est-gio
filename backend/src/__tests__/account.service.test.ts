import { describe, it, expect, beforeEach } from "vitest";
import { AccountRepository } from "../repositories/account.repository";
import { AccountService } from "../services/account.service";
import { AccountType } from "../types";

describe("AccountService", () => {
  let repository: AccountRepository;
  let service: AccountService;

  beforeEach(() => {
    repository = new AccountRepository();
    service = new AccountService(repository);
  });

  // Criar conta

  it("deve criar uma conta corrente com saldo zero", () => {
    const account = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });

    expect(account.holder).toBe("João");
    expect(account.type).toBe("checking");
    expect(account.balance).toBe(0);
    expect(account.id).toBeDefined();
  });

  it("deve criar uma conta poupança", () => {
    const account = service.createAccount({
      holder: "Maria",
      type: AccountType.SAVINGS,
    });

    expect(account.type).toBe("savings");
  });

  it("deve rejeitar titular vazio", () => {
    expect(() =>
      service.createAccount({ holder: "", type: AccountType.CHECKING }),
    ).toThrow("Nome do titular é obrigatório.");
  });

  it("deve rejeitar tipo inválido", () => {
    expect(() =>
      service.createAccount({ holder: "João", type: "invalid" as any }),
    ).toThrow("Tipo de conta inválido.");
  });

  // Depositar

  it("deve depositar valor na conta", () => {
    const account = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });

    const result = service.deposit(account.id, { amount: 100 });

    expect(result.balance).toBe(100);
  });

  it("deve rejeitar depósito com valor negativo", () => {
    const account = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });

    expect(() => service.deposit(account.id, { amount: -50 })).toThrow(
      "O valor do depósito deve ser positivo.",
    );
  });

  // Saque

  it("deve cobrar tarifa de R$1 no saque da conta corrente", () => {
    const account = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });
    service.deposit(account.id, { amount: 100 });

    const result = service.withdraw(account.id, { amount: 50 });

    expect(result.balance).toBe(49); // 100 - 50 - 1
    expect(result.fee).toBe(1);
  });

  it("não deve cobrar tarifa no saque da poupança", () => {
    const account = service.createAccount({
      holder: "Maria",
      type: AccountType.SAVINGS,
    });
    service.deposit(account.id, { amount: 100 });

    const result = service.withdraw(account.id, { amount: 50 });

    expect(result.balance).toBe(50);
    expect(result.fee).toBe(0);
  });

  it("deve permitir saque usando cheque especial (até -500)", () => {
    const account = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });
    service.deposit(account.id, { amount: 100 });

    const result = service.withdraw(account.id, { amount: 599 });

    expect(result.balance).toBe(-500);
  });

  it("não deve permitir saldo negativo na poupança", () => {
    const account = service.createAccount({
      holder: "Maria",
      type: AccountType.SAVINGS,
    });
    service.deposit(account.id, { amount: 50 });

    expect(() => service.withdraw(account.id, { amount: 51 })).toThrow(
      "Saldo insuficiente",
    );
  });

  // Transferência

  it("deve transferir entre contas com tarifa na corrente", () => {
    const corrente = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });
    const poupanca = service.createAccount({
      holder: "Maria",
      type: AccountType.SAVINGS,
    });

    service.deposit(corrente.id, { amount: 200 });

    const result = service.transfer(corrente.id, {
      toAccountId: poupanca.id,
      amount: 50,
    });

    expect(result.from.balance).toBe(149); // 200 - 50 - 1
    expect(result.to.balance).toBe(50);
    expect(result.fee).toBe(1);
  });

  it("deve transferir da poupança sem tarifa", () => {
    const poupanca1 = service.createAccount({
      holder: "Maria",
      type: AccountType.SAVINGS,
    });
    const poupanca2 = service.createAccount({
      holder: "José",
      type: AccountType.SAVINGS,
    });

    service.deposit(poupanca1.id, { amount: 100 });

    const result = service.transfer(poupanca1.id, {
      toAccountId: poupanca2.id,
      amount: 30,
    });

    expect(result.from.balance).toBe(70);
    expect(result.to.balance).toBe(30);
    expect(result.fee).toBe(0);
  });

  it("não deve transferir para a mesma conta", () => {
    const conta = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });

    expect(() =>
      service.transfer(conta.id, { toAccountId: conta.id, amount: 10 }),
    ).toThrow("Não é possível transferir para a mesma conta.");
  });

  it("não deve transferir se saldo insuficiente", () => {
    const corrente = service.createAccount({
      holder: "João",
      type: AccountType.CHECKING,
    });
    const poupanca = service.createAccount({
      holder: "Maria",
      type: AccountType.SAVINGS,
    });

    service.deposit(corrente.id, { amount: 10 });

    expect(() =>
      service.transfer(corrente.id, {
        toAccountId: poupanca.id,
        amount: 1000,
      }),
    ).toThrow("Saldo insuficiente");
  });
});
