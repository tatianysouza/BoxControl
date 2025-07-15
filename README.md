# 📦 BoxControl

Um sistema web para gerenciamento de vendas, produtos, usuários e controle de caixa, desenvolvido para facilitar o dia a dia de estabelecimentos com múltiplos funcionários e funções. Permite login de usuários, registro de vendas, visualização de métricas e muito mais de forma simples e organizada.

> *ps: sim, eu sei que “BoxControl” não é exatamente como se diz “controle de caixa” em inglês... mas é estiloso, vai.*

## Funcionalidades atuais

Funcionalidades com componentes prototipados:

- Login
- Tela de escolha pós-login
- Perfil do usuário
- Controle de estoque

## Como rodar o projeto

### Backend

1. Vá até a pasta `backend`
2. Instale as dependências:

```bash
npm install
```

3. Crie um banco de dados no PostgreSQL com o nome:
```bash
boxcontrol
```

4. Crie um arquivo .env com o seguinte conteúdo:
```bash
DATABASE_URL="postgresql://USUÁRIO:SENHA@localhost:5432/boxcontrol"
PORT=
JWT_SECRET=
```

5. Rode o projeto:
```bash
npm run dev
```
### Frontend

1. Abra outro terminal e vá até a pasta `frontend`
2. Instale as dependências:

```bash
npm install
```

3. Rode o projeto:
```bash
npm run dev
```

### Testes:
```bash
npm run test
```
