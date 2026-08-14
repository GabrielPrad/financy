# TODO — ações que dependem de você

O código está completo e testado localmente. O que sobrou são passos que **eu não consigo executar**
por precisarem das suas contas, do seu navegador ou de acesso a serviços externos.

---

## 🔴 Obrigatório para a entrega

### 1. Publicar o repositório no GitHub

O desafio exige um repositório **público** com as subpastas `backend/` e `frontend/` — a estrutura
já está exatamente assim. Falta versionar e publicar:

```bash
cd "c:/Users/Gabriel/Documents/Aulas - FTR/financy"

git init
git add .
git commit -m "feat: desafio Financy — API GraphQL e front-end React"
git branch -M main

# crie o repositório PÚBLICO em https://github.com/new (sem README, sem .gitignore)
git remote add origin https://github.com/<seu-usuario>/financy.git
git push -u origin main
```

> Confira antes do push: os arquivos `.env` (backend e frontend) e o banco `backend/prisma/dev.db`
> **não** podem ir para o repositório. Os `.gitignore` já cuidam disso — rode `git status` para
> confirmar que eles não aparecem na lista.

Depois envie o link do repositório na plataforma da Rocketseat.
**Prazo de envio: 03/08/26 a 17/08/26.**

---

### 2. Conferir o layout no Figma

Esta é a única exigência do desafio que **não pude verificar**: não tenho acesso ao arquivo do
Figma ("Financy — Layout · Figma"), então construí a interface a partir da descrição do desafio
(6 páginas + 2 modais) seguindo um design system próprio, coerente e completo.

Abra o Figma e compare, ajustando o que divergir:

- [ ] **Paleta** — hoje o tema usa roxo `#7C3AED` como cor de marca, verde `#059669` para entradas
      e vermelho `#E11D48` para saídas. Tudo está centralizado no bloco `@theme` de
      [`frontend/src/index.css`](frontend/src/index.css) — trocar lá reflete na aplicação inteira.
- [ ] **Tipografia** — está usando **Inter** (via Google Fonts, em `frontend/index.html`).
- [ ] **Espaçamentos, raios e sombras** — `--radius-card`, `--shadow-card` e `--shadow-pop`, também
      no `@theme`.
- [ ] **Estrutura das telas** — sidebar escura no desktop, drawer no mobile, e login/cadastro em
      tela dividida com painel de marca à esquerda.
- [ ] **Nomes das 6 páginas** — assumi Login, Cadastro, Dashboard, Transações, Categorias e Perfil.
      Se o Figma tiver outro conjunto (por exemplo, uma tela de relatórios no lugar do perfil),
      me avise que eu ajusto.

---

## 🟡 Recomendado

### 3. Trocar o `JWT_SECRET`

O `backend/.env` está com um valor de desenvolvimento (`financy-dev-secret-change-me`). Gere um
segredo real:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4. Limpar o banco de testes

O `backend/prisma/dev.db` contém as contas que criei ao validar a aplicação (`ana-*@financy.dev`,
`e2e-*@financy.dev`). O arquivo é ignorado pelo Git, então **não vai para o repositório** — mas se
quiser começar do zero na sua máquina:

```bash
cd backend
npm run db:reset
```

---

## 🟢 Opcional — "Quer ir além?"

> ⚠️ O desafio pede que funcionalidades extras fiquem em **outra branch**, preservando o código
> original da entrega:
> ```bash
> git checkout -b feature/extras
> ```

- [ ] **Upload de imagem de avatar** — hoje o perfil aceita a **URL** de uma imagem. O upload de
      arquivo pediria armazenamento (S3, Cloudinary, disco local) e uma rota de upload na API.
- [ ] **Testes automatizados** — Vitest no front e Vitest/Jest + banco de testes no back. Validei
      tudo com scripts temporários durante o desenvolvimento, mas não deixei uma suíte no repositório.
- [ ] **Docker Compose** — subir API e banco com um comando só.
- [ ] **CI no GitHub Actions** — rodar `typecheck` e `build` a cada push.
- [ ] **Paginação nas transações** — a API já aceita `limit` e `offset`; falta a UI consumir.
- [ ] **Post no LinkedIn** — o desafio sugere compartilhar a experiência e marcar a Rocketseat 🚀

---

## ✅ O que já está pronto e verificado

- 10/10 requisitos do back-end e 10/10 do front-end (checklist em
  [`desafio-financy.md`](desafio-financy.md))
- `.env.example` nos dois projetos, com todas as chaves usadas
- CORS habilitado e configurável por variável de ambiente
- Isolamento por usuário validado: um usuário não lê, edita nem exclui dados de outro
- `npm run build` passa nos dois projetos, sem erros de tipo
