import express, { Request, Response, NextFunction } from "express";
import { AccountRepository } from "./repositories/account.repository";
import { AccountService } from "./services/account.service";
import { AccountController } from "./controllers/account.controller";
import { createAccountRoutes } from "./routes/account.routes";
import { AppError } from "./errors/app-error";
import { ErrorResponse } from "./types";

// Instanciando as classes
const repository = new AccountRepository();
const service = new AccountService(repository);
const controller = new AccountController(service);

const app = express();

app.use(express.json());

// Rotas
app.use(createAccountRoutes(controller));

// Middleware de erro
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  console.error("Erro inesperado:", err);

  const body: ErrorResponse = {
    error: {
      code: "INTERNAL_ERROR",
      message: "Erro interno do servidor.",
    },
  };
  res.status(500).json(body);
});

export { app };
