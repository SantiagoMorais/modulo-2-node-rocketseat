# API Rest Node.JS

## Sumário

- [Imagens](#imagens)
- [Bibliotecas](#bibliotecas)
- [Funcionalidades do projeto](#funcionalidades-do-projeto)

## Imagens

## Bibliotecas

### Bibliotecas de produção

- [Fastify](https://fastify.dev): Framework web para Node.js usado para criar APIs e servidores HTTP (similar ao Express.js) e possio suporte à tipagem TypeScript.

- [Knex](https://knexjs.org): **SQL query builder** utilizado para simplificar a linguagem sql. É um construtor de queries, que facilita a escrita do código usando javascript. Similar a um ORM.

- [sqlite3](https://www.sqlite.org): Driver do banco de dados do SQLite.

### Bibliotecas de desenvolvimento

- [ESLint](https://eslint.org/): Ferramenta para análise de código, responsável por identificar erros e inconsistências, como variáveis não utilizadas ou não declaradas.

- [Prettier](https://prettier.io/): Ferramenta de formatação de código como indentação, espaçamento, uso de aspas simples ou duplas, etc, garantindo consistência no estilo do código.

## Funcionalidades do projeto

### Criação do banco de dados utilizando `knex`

```ts
import setupKnex from "knex";
import type { Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: "./db/app.db",
  },
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
```

Configurações iniciais do banco de dados e da migrations. Nossa config precisa ser separada, pois ela será usada para criarmos a migration. Já o `knex`  será a conexão com o banco.

### Migration

Criar o arquivo `knexfile.ts` na raiz do projeto. Essa estrutura é importante para que o `knex` saiba quais são nossas configurações do banco.

```ts
import { config } from "./src/database.js";

export default config;
```

Antes de executarmos o comando para executar a migration, vamos criar um script para que possamos usar o `tsx` junto do `knex`

```json
    "knex": "tsx ./node_modules/knex/bin/cli.js --knexfile=knexfile.ts"
```

Agora é possível criar a migration com `npm run knex -- migrate:make create-documents`
O nome da migration precisa fazer sentido com qual alteração quero fazer no banco de dados.

## Como rodar o projeto

1. Instalar as dependências com `npm install`
2. Criar migração do banco de dados com `npx knex migrate:make create-documents`
