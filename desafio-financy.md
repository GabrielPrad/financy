# Desafio Prático: Financy

**Trilha:** Expansão de Habilidades
**Status:** ✅ CONCLUÍDO — 24 de 24 tarefas

---

## Tarefas (Checklist)

**24 de 24 concluídas**

### [Back-end]

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Deve ser possível criar uma transação
- [x] Deve ser possível deletar uma transação
- [x] Deve ser possível editar uma transação
- [x] Deve ser possível listar todas as transações
- [x] Deve ser possível criar uma categoria
- [x] Deve ser possível deletar uma categoria
- [x] Deve ser possível editar uma categoria
- [x] Deve ser possível listar todas as categorias

### [Front-end]

- [x] O usuário pode criar uma conta e fazer login
- [x] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [x] Deve ser possível criar uma transação
- [x] Deve ser possível deletar uma transação
- [x] Deve ser possível editar uma transação
- [x] Deve ser possível listar todas as transações
- [x] Deve ser possível criar uma categoria
- [x] Deve ser possível deletar uma categoria
- [x] Deve ser possível editar uma categoria
- [x] Deve ser possível listar todas as categorias
- [x] É obrigatória a criação de uma aplicação React usando GraphQL para consultas na API e Vite como bundler
- [x] Siga o mais fielmente possível o layout do Figma ⚠️ *ver observação abaixo*

---

## Onde cada requisito foi implementado

### Back-end

| Requisito | Implementação |
| --- | --- |
| Criar conta e login | `signUp` / `signIn` em [`backend/src/graphql/resolvers/auth.ts`](backend/src/graphql/resolvers/auth.ts) — bcrypt + JWT |
| Ver/gerenciar apenas os próprios dados | `requireUserId` em [`backend/src/graphql/context.ts`](backend/src/graphql/context.ts); o `userId` entra em todo `where` do Prisma |
| Criar transação | `createTransaction` |
| Deletar transação | `deleteTransaction` |
| Editar transação | `updateTransaction` |
| Listar transações | `transactions(filter, limit, offset)` |
| Criar categoria | `createCategory` |
| Deletar categoria | `deleteCategory` (bloqueada se houver transações vinculadas) |
| Editar categoria | `updateCategory` |
| Listar categorias | `categories` |

Resolvers de transação e categoria em
[`backend/src/graphql/resolvers/`](backend/src/graphql/resolvers/).

### Front-end

| Requisito | Implementação |
| --- | --- |
| Criar conta e login | [`pages/sign-up.tsx`](frontend/src/pages/sign-up.tsx) e [`pages/login.tsx`](frontend/src/pages/login.tsx) |
| Ver/gerenciar apenas os próprios dados | Token JWT injetado pelo Apollo em [`lib/apollo.ts`](frontend/src/lib/apollo.ts); a API filtra por usuário |
| Criar / editar transação | Modal [`transaction-dialog.tsx`](frontend/src/components/transactions/transaction-dialog.tsx) |
| Deletar transação | `ConfirmDialog` + `useTransactionActions` |
| Listar transações | [`pages/transactions.tsx`](frontend/src/pages/transactions.tsx) com filtros |
| Criar / editar categoria | Modal [`category-dialog.tsx`](frontend/src/components/categories/category-dialog.tsx) |
| Deletar categoria | `ConfirmDialog` em [`pages/categories.tsx`](frontend/src/pages/categories.tsx) |
| Listar categorias | [`pages/categories.tsx`](frontend/src/pages/categories.tsx) |

---

## Requisitos não funcionais

### Back-end

- [x] **TypeScript** — projeto inteiro em TS estrito (ESM)
- [x] **GraphQL** — Apollo Server 5
- [x] **Prisma** — ORM e migrações
- [x] **SQLite** — banco de dados
- [x] **CORS habilitado** — middleware `cors` configurável por `CORS_ORIGIN`
- [x] **`.env.example`** com `JWT_SECRET` e `DATABASE_URL` (e as opcionais documentadas)

### Front-end

- [x] **TypeScript**
- [x] **React** 19
- [x] **Vite sem framework**
- [x] **GraphQL** — Apollo Client 4
- [x] **`.env.example`** com `VITE_BACKEND_URL`
- [x] *(flexível)* TailwindCSS, React Hook Form, Zod, componentes no estilo Shadcn

---

## Páginas

O desafio pede **6 páginas e dois modais com formulários (Dialog)**:

| # | Página | Rota |
| --- | --- | --- |
| 1 | Login | `/` (deslogado) |
| 2 | Dashboard | `/` (logado) |
| 3 | Cadastro | `/cadastro` |
| 4 | Transações | `/transacoes` |
| 5 | Categorias | `/categorias` |
| 6 | Perfil | `/perfil` |

Modais: **Nova/Editar transação** e **Nova/Editar categoria**.
Extra: página 404 e um diálogo de confirmação para as exclusões.

---

## ⚠️ Observação sobre o Figma

O layout foi construído a partir da descrição do desafio (6 páginas + 2 modais), **sem acesso ao
arquivo do Figma**. O style guide está centralizado no bloco `@theme` de
[`frontend/src/index.css`](frontend/src/index.css), então alinhar cores, fontes, raios e sombras ao
Figma é uma edição em um único arquivo.

Passo a passo da conferência em [`TODO.md`](TODO.md).

---

## Entrega

- [x] Repositório com as subpastas `backend/` e `frontend/`
- [x] Código com todas as regras e funcionalidades obrigatórias
- [ ] **Repositório público no GitHub** → ver [`TODO.md`](TODO.md)
- [ ] **Link enviado na plataforma** → ver [`TODO.md`](TODO.md)

**Período de envio:** 03/08/26 a 17/08/26
