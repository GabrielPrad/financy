# Financy

Aplicação **full stack** de gerenciamento de finanças pessoais: cadastro de conta, login, e o
controle completo de **transações** e **categorias** — cada usuário enxerga e gerencia apenas os
próprios dados.

Projeto desenvolvido como desafio prático da trilha **Expansão de Habilidades** (Pós-Graduação
Rocketseat).

---

## 🛠️ Tecnologias

| Back-end | Front-end |
| --- | --- |
| TypeScript | TypeScript |
| GraphQL (Apollo Server 5) | GraphQL (Apollo Client 4) |
| Prisma ORM | React 19 |
| SQLite | Vite (sem framework) |
| Express 5 + CORS | TailwindCSS v4 |
| JWT + bcrypt | React Hook Form + Zod |
| Zod (validação) | Radix UI + lucide-react |

---

## ✅ Funcionalidades

### Autenticação
- [x] Criar conta (`signUp`) com senha protegida por bcrypt
- [x] Login (`signIn`) com retorno de token JWT
- [x] Sessão persistida no `localStorage` e restaurada ao recarregar a página
- [x] Token expirado/inválido derruba a sessão automaticamente
- [x] Edição de perfil (nome, e-mail, avatar e troca de senha)

### Transações
- [x] Criar, listar, editar e excluir
- [x] Tipos **entrada** (INCOME) e **saída** (EXPENSE)
- [x] Filtros por texto, tipo, categoria e período
- [x] Totais de entradas, saídas e saldo do período

### Categorias
- [x] Criar, listar, editar e excluir
- [x] Cor e ícone personalizados
- [x] Nome único por usuário
- [x] Exclusão bloqueada quando existem transações vinculadas

### Isolamento por usuário
Toda query e mutation de dados passa por `requireUserId`, e o `userId` entra em **todas** as
cláusulas `where` do Prisma. Um usuário não consegue ler, editar nem excluir registros de outro —
nem informando o `id` diretamente.

---

## 🗺️ Páginas

| Rota | Tela |
| --- | --- |
| `/` | **Login** quando deslogado · **Dashboard** quando logado |
| `/cadastro` | Criação de conta |
| `/transacoes` | Listagem completa com filtros |
| `/categorias` | Gerenciamento de categorias |
| `/perfil` | Dados da conta e troca de senha |
| `*` | Página 404 |

E os dois **modais de formulário** (Dialog) exigidos pelo desafio:
**Nova/Editar transação** e **Nova/Editar categoria**.

---

## 📡 API GraphQL

```graphql
type Query {
  me: User
  categories: [Category!]!
  category(id: ID!): Category
  transactions(filter: TransactionsFilterInput, limit: Int, offset: Int): [Transaction!]!
  transaction(id: ID!): Transaction
  summary(filter: TransactionsFilterInput): Summary!
  expensesByCategory(filter: TransactionsFilterInput): [CategorySummary!]!
}

type Mutation {
  signUp(input: SignUpInput!): AuthPayload!
  signIn(input: SignInInput!): AuthPayload!
  updateProfile(input: UpdateProfileInput!): User!

  createCategory(input: CreateCategoryInput!): Category!
  updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
  deleteCategory(id: ID!): Boolean!

  createTransaction(input: CreateTransactionInput!): Transaction!
  updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
  deleteTransaction(id: ID!): Boolean!
}
```

Requisições autenticadas usam o header:

```
Authorization: Bearer <token>
```

Detalhes de cada campo em [`backend/README.md`](backend/README.md).

---

