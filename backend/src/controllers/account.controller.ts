import { Request, Response, NextFunction } from "express";
import { AccountService } from "../services/account.service";
import {
  CreateAccountDTO,
  WithdrawDTO,
  TransferDTO,
  DepositDTO,
} from "../types";

export class AccountController {
  constructor(private service: AccountService) {}

  create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dto: CreateAccountDTO = req.body;
      const account = this.service.createAccount(dto);
      res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  };

  findAll = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const accounts = this.service.findAll();
      res.json(accounts);
    } catch (error) {
      next(error);
    }
  };

  findById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const account = this.service.findById(id);
      res.json(account);
    } catch (error) {
      next(error);
    }
  };

  withdraw = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const dto: WithdrawDTO = req.body;
      const result = this.service.withdraw(id, dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  transfer = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const dto: TransferDTO = req.body;
      const result = this.service.transfer(id, dto);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deposit = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = req.params.id as string;
      const dto: DepositDTO = req.body;

      const result = this.service.deposit(id, dto);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
