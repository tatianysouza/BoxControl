# 📦 BoxControl

Um sistema web para gerenciamento de vendas, produtos, usuários e controle de caixa, desenvolvido para facilitar o dia a dia de estabelecimentos com múltiplos funcionários e funções. Permite login de usuários, registro de vendas, visualização de métricas e muito mais de forma simples e organizada.

> *ps: sim, eu sei que “BoxControl” não é exatamente como se diz “controle de caixa” em inglês... mas é estiloso, vai.*

## Funcionalidades

Funcionalidades com componentes prototipados:

- Login
- Tela de escolha pós-login
- Controle de caixa
- Perfil do usuário
- Controle de estoque
- Controle de vendas
- Minhas vendas
- Funcionários
- Dashboard

## Como rodar o projeto

### Backend

1. Vá até a pasta `backend`
2. Instale as dependências:

```bash
npm install
```

3. Para criar o banco de dados:
```bash
npx prisma migrate dev
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

3. Antes de rodar o projeto, vá até o arquivo `socket.ts` e substitua o valor `xxx.xxx.xx.x` pelo IP da sua internet. Esse mesmo IP deve ser configurado também no aplicativo de leitor de código de barras para que a conexão funcione corretamente.

4. Rode o projeto:
```bash
npm run dev
```

### Testes:
```bash
npm run test
```

--
## 📱 Aplicativo de Leitor de Código de Barras

Para **realizar as vendas**, é necessário utilizar também o aplicativo de leitor de código de barras.  
Esse app é responsável por capturar os códigos dos produtos cadastrados no banco de dados e integrá-los ao sistema.

### Repositório do Leitor de código de barras
Clone o repositório do leitor de código de barras a partir do link abaixo:

👉 [Leitor de Código de Barras](https://github.com/tatianysouza/BarCodeScanner.git)  

### Configuração
Após clonar, siga os passos descritos no **README do repositório do leitor** para configurar corretamente o aplicativo.

### Uso
1. Abra o app de leitor de código de barras.  
2. Escaneie os produtos cadastrados no banco de dados.  
3. O sistema de vendas irá reconhecer os códigos lidos e adicionar o produto a lista de compras.  

⚠️ **Atenção**: sem o uso do aplicativo de leitor de código de barras, não será possível registrar vendas.
