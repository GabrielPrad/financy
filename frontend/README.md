# Financy — Front-end

SPA em React que consome a API GraphQL do Financy.

## Stack

- **React 19** + **TypeScript**
- **Vite** (sem framework)
- **Apollo Client 4** para as consultas GraphQL
- **TailwindCSS v4** (tema no `src/index.css`)
- **React Hook Form** + **Zod** nos formulários
- **Radix UI** (Dialog, Select, Dropdown, Avatar) + **lucide-react**
- **sonner** para os toasts

## Como rodar

> A API precisa estar rodando antes (veja `../backend/README.md`).

```bash
npm install
cp .env.example .env    # Windows/PowerShell: copy .env.example .env
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos + build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o oxlint |

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `VITE_BACKEND_URL` | Endpoint GraphQL da API (ex.: `http://localhost:4000/graphql`) |

Se a variável não estiver definida, a aplicação falha no boot com uma mensagem explícita em vez de
quebrar silenciosamente na primeira requisição.

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | **Login** quando deslogado · **Dashboard** quando logado |
| `/cadastro` | Criação de conta |
| `/transacoes` | Listagem completa com filtros |
| `/categorias` | Gerenciamento de categorias |
| `/perfil` | Dados da conta e troca de senha |
| `*` | Página 404 |

Rotas internas acessadas sem sessão redirecionam para o login.

## Estrutura

```
src/
├── main.tsx                  # ApolloProvider + AuthProvider + Router
├── App.tsx                   # Definição das rotas
├── index.css                 # Style guide: cores, raios, sombras, fonte
├── lib/
│   ├── apollo.ts             # Client, link de auth e tratamento de 401
│   ├── auth-storage.ts       # Token no localStorage
│   ├── validation.ts         # Schemas Zod dos formulários
│   ├── format.ts             # Moeda, datas e percentuais em pt-BR
│   ├── errors.ts             # Mensagens amigáveis a partir dos erros da API
│   └── utils.ts              # cn() — clsx + tailwind-merge
├── graphql/
│   ├── operations.ts         # Queries, mutations e fragments
│   └── types.ts              # Tipos espelhando o schema
├── contexts/auth-context.tsx # Sessão do usuário
├── hooks/                    # useAuth, useTransactionActions
├── components/
│   ├── ui/                   # Button, Input, Field, Dialog, Select, Card…
│   ├── layout/               # AppLayout, AuthLayout, Logo, PageHeader
│   ├── transactions/         # Dialog de transação + listagem
│   ├── categories/           # Dialog de categoria + ícones
│   └── dashboard/            # Cards de resumo + gastos por categoria
└── pages/                    # login, sign-up, dashboard, transactions,
                              # categories, profile, not-found
```

## Autenticação

O token JWT fica no `localStorage` e é injetado no header `Authorization` pelo `SetContextLink` do
Apollo. Um `ErrorLink` observa respostas `UNAUTHENTICATED`: quando o token expira, a sessão é
limpa e o usuário volta para o login sem precisar recarregar a página.

## Tema

Todas as cores, raios, sombras e a tipografia estão declaradas em um único bloco `@theme` no
`src/index.css`, gerando as utilitárias do Tailwind:

- `brand-*` — roxo da marca
- `ink-*` — escala de neutros
- `income` / `expense` — verde das entradas e vermelho das saídas
- `rounded-card`, `shadow-card`, `shadow-pop`
