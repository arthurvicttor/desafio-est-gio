# Desafio Técnico — Banco 🏦

## Funcionalidades

- Criação de contas (Corrente e Poupança)
- Depósito, saque e transferência entre contas
- Conta Corrente com tarifa de R$1,00 por operação e cheque especial de até -R$500,00
- Conta Poupança sem tarifas e saldo nunca negativo
- Tratamento de erros padronizado na API
- Testes unitários cobrindo as regras de negócio

---

## Tecnologias

**Backend** — Node.js · TypeScript · Express · Vitest  
**Frontend** — React · TypeScript · Vite · React Router DOM

---

## Estrutura

```
banco-app/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── errors/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── tests/
│       ├── types/
│       ├── app.ts
│       └── server.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       ├── App.tsx
│       └── main.tsx
│
└── README.md
```

---

## Instalação

### Pré-requisitos

- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
npm install
npm run dev
```

Servidor disponível em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

---

## Testes

```bash
cd backend
npm test
```

14 testes cobrindo saque, depósito, transferência, cheque especial e bloqueio de saldo negativo na poupança.

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/accounts` | Criar conta |
| GET | `/accounts` | Listar contas |
| GET | `/accounts/:id` | Buscar conta |
| POST | `/accounts/:id/deposit` | Depositar |
| POST | `/accounts/:id/withdraw` | Sacar |
| POST | `/accounts/:id/transfer` | Transferir |

### Exemplos

**Criar conta**
```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{"holder": "João Silva", "type": "checking"}'
```

```json
{
  "id": "abc-123",
  "holder": "João Silva",
  "type": "checking",
  "balance": 0
}
```

**Saque com tarifa**
```bash
curl -X POST http://localhost:3000/accounts/abc-123/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'
```

```json
{
  "id": "abc-123",
  "holder": "João Silva",
  "type": "checking",
  "balance": 49,
  "fee": 1
}
```

**Transferência**
```bash
curl -X POST http://localhost:3000/accounts/abc-123/transfer \
  -H "Content-Type: application/json" \
  -d '{"toAccountId": "def-456", "amount": 30}'
```

```json
{
  "from": { "id": "abc-123", "holder": "João Silva", "type": "checking", "balance": 18 },
  "to": { "id": "def-456", "holder": "Maria Souza", "type": "savings", "balance": 30 },
  "amount": 30,
  "fee": 1
}
```

---

## Arquitetura

O backend segue uma separação clara de responsabilidades em camadas:

```
Rotas → Controller → Service → Repository → Model
```

- **Rotas** — mapeiam os endpoints para os controllers
- **Controller** — extrai os dados da requisição e formata a resposta
- **Service** — aplica as regras de negócio
- **Repository** — gerencia o armazenamento em memória
- **Model** — entidades com comportamento próprio via herança

As entidades `CheckingAccount` e `SavingsAccount` estendem uma classe base `Account` que define o contrato de saque. Cada subclasse implementa suas próprias regras — sem lógica condicional espalhada pelo código.

---

## Regras de Negócio

| Regra | Conta Corrente | Conta Poupança |
|-------|---------------|----------------|
| Tarifa de saque | R$1,00 | — |
| Tarifa de transferência | R$1,00 | — |
| Saldo negativo | Até -R$500,00 | Nunca |

---

## Erros

| HTTP | Código | Descrição |
|------|--------|-----------|
| 400 | `INVALID_HOLDER` | Nome do titular vazio |
| 400 | `INVALID_TYPE` | Tipo de conta inválido |
| 400 | `INVALID_AMOUNT` | Valor menor ou igual a zero |
| 400 | `SAME_ACCOUNT` | Transferência para a mesma conta |
| 404 | `ACCOUNT_NOT_FOUND` | Conta não encontrada |
| 422 | `INSUFFICIENT_BALANCE` | Saldo insuficiente |
| 500 | `INTERNAL_ERROR` | Erro interno |
