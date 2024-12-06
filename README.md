# WhatsTheTape Backend

Este repositório contém o backend do projeto **WhatsTheTape**, que é responsável por gerenciar as funcionalidades principais da API, autenticação de usuários e interação com o banco de dados.

## Funcionalidades Principais

- **CRUD de Usuários**: Permite criar, ler, atualizar e excluir informações de usuários.
- **CRUD de Tracks**: Gerenciamento de postagens relacionadas a música.
- **Autenticação JWT**: Implementação segura de autenticação via tokens JWT.
- **Envio de Emails**: Integração com AWS SES para envio de emails transacionais. Atualmente, esta funcionalidade não está completamente implementada para envio de emails para outros destinatários, devido à ausência do modo de produção. Por isso, a autenticação utiliza a senha padrão `12345678` para testes.

## Tecnologias Utilizadas

- **TypeScript**: Usado para maior segurança e tipagem no desenvolvimento do backend.
- **Node.js**: Ambiente de execução para o servidor backend.
- **Express.js**: Framework web para construção de APIs.
- **Prisma**: ORM utilizado para interação com o banco de dados.
- **JWT (jsonwebtoken)**: Para autenticação e geração de tokens.
- **dotenv**: Para gerenciar variáveis de ambiente.
- **AWS SES**: Para envio de emails.

## Infraestrutura de Hospedagem

O backend está hospedado em um servidor **Amazon EC2** com o gerenciamento do processo feito pelo **PM2**. A integração com AWS SES permite o envio de emails para comunicação transacional.

## Scripts Disponíveis

No arquivo `package.json`, você encontra os seguintes scripts:

- `npm run build`: Compila o projeto TypeScript em JavaScript.
- `npm run dev`: Executa o servidor em modo de desenvolvimento com recarga automática (usando `concurrently`, `nodemon` e `tsc --watch`).
- `npm start`: Inicia o servidor para produção (necessário configurar).

## Requisitos de Instalação

1. Clone o repositório do backend:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`. Um exemplo de configuração:

   ```env
   DATABASE_URL="postgresql://usuario:senha@host:porta/database"
   JWT_SECRET="sua_chave_secreta"
   AWS_ACCESS_KEY_ID="sua_chave_aws"
   AWS_SECRET_ACCESS_KEY="sua_chave_secreta_aws"
   AWS_REGION="regiao_da_sua_instancia"
   ```

4. Para desenvolvimento, inicie o servidor:

   ```bash
   npm run dev
   ```

5. Para produção, use o PM2 para gerenciar o servidor:

   ```bash
   pm2 start dist/index.js --name whatsthetape-backend
   ```

## Estrutura do Projeto

- **src/**: Contém os arquivos de código-fonte.
  - **routes/**: Define as rotas da API.
  - **controllers/**: Contém a lógica de negócios.
  - **services/**: Gerencia a interação com recursos externos como AWS SES e banco de dados.
  - **middleware/**: Middleware de autenticação e outros filtros.
- **prisma/**: Contém os esquemas do banco de dados.
- **.env**: Arquivo para variáveis de ambiente.

## Testes

Atualmente, testes não estão configurados. Para adicionar testes futuramente, recomenda-se utilizar bibliotecas como `jest` ou `mocha`.

## Licença

Este projeto está licenciado sob os termos da [Licença ISC](LICENSE).

