import { Router } from "express";
import { AccountController } from "../controllers/account.controller";

export function createAccountRoutes(controller: AccountController): Router {
  const router = Router();

  router.post("/accounts", controller.create);
  router.get("/accounts", controller.findAll);
  router.get("/accounts/:id", controller.findById);
  router.post("/accounts/:id/withdraw", controller.withdraw);
  router.post("/accounts/:id/transfer", controller.transfer);
  router.post("/accounts/:id/deposit", controller.deposit);

  return router;
}
