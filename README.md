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

Criação do banco de dados utilizando `knex`

```ts
import setupKnex from "knex";

export const knex = setupKnex({
    client: "sqlite",
    connection: {
        filename: "./tmp/app.db"
    }
})
```

A sintaxe do knex somente nos exige definirmos o banco de dados utilizado em `client` e o tipo de conexão. Como usamos o `sqlite`, só precisamos informar o local do arquivo onde o banco ficará, pois é um banco local.






