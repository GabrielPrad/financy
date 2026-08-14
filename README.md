# 💜 Financy

Aplicação **full stack** de gerenciamento de finanças pessoais: cadastro de conta, login, e o
controle completo de **transações** e **categorias** — cada usuário enxerga e gerencia apenas os
próprios dados.

Projeto desenvolvido como desafio prático da trilha **Expansão de Habilidades** (Pós-Graduação
Rocketseat).

---

## 🧱 Estrutura do repositório

```
financy/
├── backend/    → API GraphQL (Node + TypeScript + Apollo Server + Prisma + SQLite)
├── frontend/   → SPA React (Vite + TypeScript + Apollo Client + TailwindCSS)
├── TODO.md     → ações que dependem de você (publicar no GitHub, conferir o Figma…)
└── README.md
```

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

## 🚀 Como rodar o projeto

> Pré-requisito: **Node.js 20+** (o projeto foi validado no Node 22).

O back-end e o front-end rodam em terminais separados. Comece **sempre pela API**.

### 1. Back-end

```bash
cd backend
npm install
cp .env.example .env        # no Windows/PowerShell: copy .env.example .env
npm run setup               # gera o Prisma Client e cria o banco SQLite
npm run dev
```

A API sobe em **http://localhost:4000/graphql** (o Apollo Sandbox abre nessa URL pelo navegador).

> ⚠️ Preencha o `JWT_SECRET` no `.env` antes de subir — a aplicação recusa iniciar sem ele.

### 2. Front-end

```bash
cd frontend
npm install
cp .env.example .env        # no Windows/PowerShell: copy .env.example .env
npm run dev
```

A aplicação sobe em **http://localhost:5173**.

### 3. Usando

1. Acesse `http://localhost:5173`
2. Clique em **Criar conta** e cadastre-se
3. A conta já nasce com 6 categorias padrão — é só começar a lançar transações

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

## 🔐 Variáveis de ambiente

**`backend/.env`**

```env
JWT_SECRET=
DATABASE_URL="file:./dev.db"
PORT=4000
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**`frontend/.env`**

```env
VITE_BACKEND_URL=http://localhost:4000/graphql
```

---

## 🎨 Decisões de projeto

- **Valores em centavos** — o banco guarda `amountCents` como inteiro e a API expõe `amount` em
  reais. Isso elimina os erros de arredondamento de ponto flutuante em valores monetários.
- **Sem enum no banco** — o SQLite não suporta enums nativos, então `type` é uma `String` validada
  pelo Zod e tipada como `enum TransactionType` no schema GraphQL.
- **Categorias padrão no cadastro** — a conta nasce com 6 categorias para o usuário não encarar uma
  tela vazia no primeiro acesso.
- **Erros tipados** — o back-end devolve `extensions.code` (`UNAUTHENTICATED`, `BAD_USER_INPUT`,
  `NOT_FOUND`, `CONFLICT`) e um mapa `campo → mensagem`, que o front usa para mostrar mensagens
  claras em vez de "algo deu errado".
- **Gastos por categoria em barras** — barras horizontais com nome e valor escritos em cada linha,
  em vez de um gráfico de pizza: as cores são escolhidas pelo usuário e podem ficar parecidas, então
  a leitura nunca depende apenas da cor.

---

## 📄 Licença

Projeto educacional, livre para uso e estudo.
