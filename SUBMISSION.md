# Minha Solução — Banco

## Stack

**Backend:**
- Node.js 18+
- TypeScript 5.3+
- Express 4.18+
- Vitest (testes unitários)

**Frontend:**
- React 18+
- TypeScript 5.3+
- Vite 5+
- React Router DOM 6+

---

## Pré-requisitos

- Node.js 18+
- npm 9+

---

## Como executar

### Backend (API)

```bash
cd backend
npm install
npm run dev
# API disponível em http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Aplicação disponível em http://localhost:5173
```

---

## Exemplo de uso

1. Acesse `http://localhost:5173`
2. Crie uma conta corrente
3. Realize um depósito de R$100,00
4. Realize um saque de R$50,00 — o saldo resultante será R$49,00 (R$1,00 de tarifa descontado automaticamente)
5. Crie uma conta poupança para Maria Souza e faça uma transferência da conta corrente para ela — a tarifa de R$1,00 é debitada de quem envia

---

## Observações

- **Armazenamento em memória:** os dados não persistem entre reinicializações do servidor — decisão intencional para manter o projeto sem dependências externas
- **Cheque especial:** a Conta Corrente permite saldo negativo de até -R$500,00, já considerando a tarifa no cálculo
- **Conta Poupança:** sem tarifas em nenhuma operação e saldo nunca negativo
- **Testes:** 14 testes unitários cobrindo saque, depósito, transferência, cheque especial e bloqueio de saldo negativo
- **Transferência entre tipos diferentes de conta** foi implementada como diferencial — as regras de tarifa e limite seguem sempre a conta de origem
