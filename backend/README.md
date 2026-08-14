# Financy — Back-end

API GraphQL para gerenciamento de finanças pessoais.

## Stack

- **TypeScript** (ESM)
- **Apollo Server 5** + **Express 5** (com CORS habilitado)
- **Prisma ORM** + **SQLite**
- **JWT** (`jsonwebtoken`) + **bcryptjs**
- **Zod** para validação de entrada e das variáveis de ambiente

## Como rodar

```bash
npm install
cp .env.example .env    # Windows/PowerShell: copy .env.example .env
npm run setup           # prisma generate + prisma migrate deploy
npm run dev
```

API disponível em `http://localhost:4000/graphql`.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe a API em modo watch (tsx) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm run typecheck` | Checagem de tipos sem emitir arquivos |
| `npm run setup` | Gera o Prisma Client e aplica as migrações |
| `npm run db:migrate` | Cria uma nova migração em desenvolvimento |
| `npm run db:reset` | **Apaga** o banco e reaplica as migrações do zero |
| `npm run db:studio` | Abre o Prisma Studio |

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `JWT_SECRET` | ✅ | — | Segredo usado para assinar os tokens |
| `DATABASE_URL` | ✅ | — | Conexão do SQLite (`file:./dev.db`) |
| `PORT` | — | `4000` | Porta da API |
| `JWT_EXPIRES_IN` | — | `7d` | Validade do token |
| `CORS_ORIGIN` | — | `*` | Origens liberadas, separadas por vírgula |

A aplicação **não sobe** se `JWT_SECRET` ou `DATABASE_URL` estiverem faltando — o Zod valida o
ambiente no boot e aponta exatamente o que falta.

## Modelo de dados

```prisma
User        id, name, email (único), password, avatarUrl, createdAt, updatedAt
Category    id, name, color, icon, userId  →  @@unique([userId, name])
Transaction id, description, amountCents, type, date, categoryId, userId
```

- `amountCents` é um **inteiro em centavos**. A API converte para reais (`Float`) na borda GraphQL,
  o que evita erros de ponto flutuante em valores monetários.
- `type` é uma `String` (`INCOME` | `EXPENSE`) porque o SQLite não suporta enums nativos; o schema
  GraphQL expõe como `enum TransactionType`.
- Excluir um usuário remove suas categorias e transações em cascata. Uma categoria com transações
  vinculadas **não** pode ser excluída (`onDelete: Restrict`), e a mutation devolve um erro claro.

## Autenticação

`signUp` e `signIn` devolvem `{ token, user }`. Envie o token nas requisições seguintes:

```
Authorization: Bearer <token>
```

O contexto do GraphQL decodifica o token e expõe `userId`. Toda query/mutation de dados chama
`requireUserId(context)` e usa esse `userId` na cláusula `where` do Prisma — é isso que garante que
**um usuário só acessa os próprios registros**, mesmo que tente informar o `id` de outro.

## Códigos de erro

| `extensions.code` | Quando acontece |
| --- | --- |
| `UNAUTHENTICATED` | Sem token, token inválido/expirado ou credenciais erradas |
| `BAD_USER_INPUT` | Falha de validação (traz `extensions.fields` com `campo → mensagem`) |
| `NOT_FOUND` | Registro inexistente ou pertencente a outro usuário |
| `CONFLICT` | E-mail já cadastrado ou categoria com nome repetido |

## Exemplos

**Criar conta**

```graphql
mutation {
  signUp(input: { name: "Ana Souza", email: "ana@financy.dev", password: "senha123" }) {
    token
    user { id name email }
  }
}
```

**Listar transações do mês, filtrando por saídas**

```graphql
query {
  transactions(
    filter: {
      type: EXPENSE
      startDate: "2026-08-01T00:00:00.000Z"
      endDate: "2026-08-31T23:59:59.000Z"
    }
  ) {
    id
    description
    amount
    date
    category { name color }
  }
}
```

**Criar transação**

```graphql
mutation {
  createTransaction(
    input: {
      description: "Mercado do mês"
      amount: 432.75
      type: EXPENSE
      date: "2026-08-05T12:00:00.000Z"
      categoryId: "<id-da-categoria>"
    }
  ) {
    id
    amount
    category { name }
  }
}
```

## Estrutura

```
src/
├── server.ts                 # Express + Apollo + CORS
├── lib/
│   ├── env.ts                # Validação das variáveis de ambiente (Zod)
│   ├── prisma.ts             # Instância do Prisma Client
│   ├── auth.ts               # Hash de senha e emissão/verificação de JWT
│   ├── money.ts              # Conversão reais ↔ centavos
│   └── errors.ts             # Erros GraphQL tipados
└── graphql/
    ├── typeDefs.ts           # Schema SDL
    ├── context.ts            # Contexto + requireUserId
    ├── validators.ts         # Schemas Zod de entrada
    ├── filters.ts            # Montagem do where de transações
    ├── scalars/dateTime.ts   # Scalar DateTime (ISO-8601)
    └── resolvers/            # auth, category, transaction
```
