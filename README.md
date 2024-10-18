# API Rest Node.JS

## Sumário

- [Imagens](#imagens)
- [Bibliotecas](#bibliotecas)
- [Requisitos da aplicação](#requisitos-da-aplicação)
- [Funcionalidades do projeto](#funcionalidades-do-projeto)

## Imagens

## Bibliotecas

### Bibliotecas de produção

- [Fastify](https://fastify.dev): Framework web para Node.js usado para criar APIs e servidores HTTP (similar ao Express.js) e possio suporte à tipagem TypeScript.

- [Knex](https://knexjs.org): **SQL query builder** utilizado para simplificar a linguagem sql. É um construtor de queries, que facilita a escrita do código usando javascript. Similar a um ORM.

- [sqlite3](https://www.sqlite.org): Driver do banco de dados do SQLite.

- [dotenv](https://www.npmjs.com/package/dotenv): Dotenv carrega variáveis ambiente de um arquivo .env ao `process.env` em aplicações Node.js.

- [zod](https://zod.dev/): Biblioteca de validação de esquemas e dados, garantindo a segurança dos dados.

### Bibliotecas de desenvolvimento

- [ESLint](https://eslint.org/): Ferramenta para análise de código, responsável por identificar erros e inconsistências, como variáveis não utilizadas ou não declaradas.

- [Prettier](https://prettier.io/): Ferramenta de formatação de código como indentação, espaçamento, uso de aspas simples ou duplas, etc, garantindo consistência no estilo do código.

## Requisitos da aplicação
- **RF (Requisitos funcionais)**
  - [ ] O usuário deve poder criar uma nova transação.
  - [ ] O usuário deve poder obter um resumo da sua conta.
    - Valor total das somas e subtrações entre transações.
  - [ ] O usuário deve poder listar todas as transações que já ocorreram.
  - [ ] O usuário deve poder visualizar uma transação única

- **RN (Regras de negócio)**
  - [ ] A transação pode ser do tipo .**crédito** que somará ao valor total, ou **débito** que irá subtrair.
  - [ ] Deve ser possível identificarmos o usuário entre as requisições;
  - [ ] O usuário só pode visualizar transações o qual ele criou.

- **RNF (Requisitos não funcionais)**
  - 

## Funcionalidades do projeto

### Criação do banco de dados utilizando `knex`

```ts
import setupKnex from "knex";
import type { Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: "db-url",
  },
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
```

Configurações iniciais do banco de dados e da migrations. Nossa config precisa ser separada, pois ela será usada para criarmos a migration. Já o `knex` será a conexão com o banco.

### Migration

Criar o arquivo `knexfile.ts` na raiz do projeto. Essa estrutura é importante para que o `knex` saiba quais são nossas configurações do banco.

```ts
import { config } from "./src/database.js";

export default config;
```

Criar um script para usar o `tsx` junto do `knex`

```json
    "knex": "tsx ./node_modules/knex/bin/cli.js --knexfile=knexfile.ts"
```

Agora é possível criar a migration com `npm run knex -- migrate:make create-transactions`
O nome da migration precisa fazer sentido com qual alteração quero fazer no banco de dados.

### Configurando a migrations

```ts
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table.text("title").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
```

- up: A função up define o que será feito no banco, assim como os campos da tabela, a criação das tabelas, etc.
  - - Executar a criação da tabela: `npm run knex -- migrate:latest`.
- down: Faz exatamente o oposto do up, para caso precisemos refazer uma ação gerada pelo up. Exemplo, se for criado uma tabela, o down a deleta.
  - Refazer a ação da migration executada pelo up: `npm run knex -- migrate:rollback`.

### Configurando .env com zod

Instalar o `zod` e configurar o `envSchema` e utilizá-lo dentro do nosso banco de dados.

```ts
import { z } from "zod";
import 'dotenv/config'

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
```

## Como rodar o projeto

1. Instalar as dependências: `npm install`.
2. Executar a criação da tabela executando as migrations: `npm run knex -- migrate:latest`.
3. Acessar o arquivo `.env.example`, criar o arquivo `.env` e configurá-lo de acordo com os exemplos.
