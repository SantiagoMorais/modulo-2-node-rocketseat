# API Rest Node.JS

## Sumário

- [Imagens](#imagens)
- [Bibliotecas](#bibliotecas)
- [Requisitos da aplicação](#requisitos-da-aplicação)
- [Funcionalidades do projeto](#funcionalidades-do-projeto)
  - [Criação do banco de dados utilizando `knex`](#criação-do-banco-de-dados-utilizando-knex)
  - [Migration](#migration)
  - [Configurando a migrations](#configurando-a-migrations)
  - [Configurando .env com zod](#configurando-env-com-zod)
- [Rotas](#rotas)
  - [POST - criar nova transação](#post---criar-nova-transação)
  - [GET - listar todas as transações](#get---listar-todas-as-transações)
  - [GET - Retornar uma transação pelo ID](#get---retornar-uma-transação-pelo-id)
  - [GET - Retornar resumo da conta](#get---retornar-resumo-da-conta)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Autor](#autor)

## Imagens

## Bibliotecas

### Bibliotecas de produção

- [Fastify](https://fastify.dev): Framework web para Node.js usado para criar APIs e servidores HTTP (similar ao Express.js) e possio suporte à tipagem TypeScript.

- [Knex](https://knexjs.org): **SQL query builder** utilizado para simplificar a linguagem sql. É um construtor de queries, que facilita a escrita do código usando javascript. Similar a um ORM.

- [sqlite3](https://www.sqlite.org): Driver do banco de dados do SQLite.

- [dotenv](https://www.npmjs.com/package/dotenv): Dotenv carrega variáveis ambiente de um arquivo .env ao `process.env` em aplicações Node.js.

- [zod](https://zod.dev/): Biblioteca de validação de esquemas e dados, garantindo a segurança dos dados.

- [Fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod): Integra o **Zod** com o **Fastify**, permitindo validar e tipar dados das requisições HTTP para evitar erros. Usa validações do Zod para definir e validar o `body`, `params`, `query` e `headers` das requisições.

- [@fastify/cookie](https://github.com/fastify/fastify-cookie): Um plugin para o Fastify que adiciona suporte para ler e definir cookies.

### Bibliotecas de desenvolvimento

- [ESLint](https://eslint.org/): Ferramenta para análise de código, responsável por identificar erros e inconsistências, como variáveis não utilizadas ou não declaradas.

- [Prettier](https://prettier.io/): Ferramenta de formatação de código como indentação, espaçamento, uso de aspas simples ou duplas, etc, garantindo consistência no estilo do código.

- [Vitest](https://vitest.dev): Um framework de test nativo do vite, mas mais rápido que Jest. Apesar disso, a migração do Jest ao Vitest é simples, pois a sintaxe é extremamente similar.

- [Supertest](https://www.npmjs.com/package/supertest): A motivação com este módulo é fornecer uma abstração de alto nível para testar HTTP, ao mesmo tempo que permite acessar a API de nível inferior fornecida pelo `superagent`. Ou seja, testar o servidor sem precisar rodá-lo em uma porta específica, evitando conflitos.

- [@types/supertest](https://www.npmjs.com/package/@types/supertest): Vinculação do supertest ao Typescript, já que ele foi escrito exclusivamente com Javascript

- [tsup](https://tsup.egoist.dev): Ferramenta para otimizar projetos TypeScript, permitindo realizar o build (converter TS em JS) de forma eficiente. Além disso, assim como Vitest e TSX, ele utiliza o **esbuild**, que acelera processos e facilita o desenvolvimento com TypeScript de maneira moderna.

## Requisitos da aplicação

- **RF (Requisitos funcionais)**

  - [ X ] O usuário deve poder criar uma nova transação.
  - [ ] O usuário deve poder obter um resumo da sua conta.
    - Valor total das somas e subtrações entre transações.
  - [ X ] O usuário deve poder listar todas as transações que já ocorreram.
  - [ X ] O usuário deve poder visualizar uma transação única

- **RN (Regras de negócio)**

  - [ X ] A transação pode ser do tipo .**crédito** que somará ao valor total, ou **débito** que irá subtrair.
  - [ ] Deve ser possível identificarmos o usuário entre as requisições;
  - [ ] O usuário só pode visualizar transações o qual ele criou.

- **RNF (Requisitos não funcionais)**

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
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
```

## Rotas

### POST - criar nova transação:

- Rota: `"/transactions"`
- Método: `POST`
- Objetivo: Criar uma nova transação e registrá-la no banco de dados

**Dados a serem enviados no corpo da requisição**

```json
{
  "title": "Freelancer",
  "amount": 2300,
  "type": "credit"
}
```

**Tipagem dos dados a serem enviados**

```ts
    {
      schema: {
        body: z.object({
          title: z.string().min(2).max(30),
          amount: z.number().min(0.1),
          type: z.enum(["credit", "debit"]),
        }),
      },
    },
```

### GET - listar todas as transações

- Rota: `"/transactions"`
- Método: `GET`
- Objetivo: Listar as transações do usuário

**Estrutura dos dados recebidos**

```js
{
	"total": 2,
	"transactions": [
		{
			"id": "0490f1b9-4a84-439b-9c29-bbd33fc76447",
			"title": "Transação de teste",
			"amount": 1000,
			"created_at": "2024-10-17 22:14:05",
			"session_id": null
		},
		{
			"id": "80ce5a74-4642-4fc3-b78e-00e3504fbdcc",
			"title": "Freelancer",
			"amount": 2300,
			"created_at": "2024-10-18 12:34:00",
			"session_id": null
		}
	]
}
```

### GET - retornar uma transação pelo ID

- Rota: `"/transactions/:id"`
- Método: `GET`
- Objetivo: Retornar uma transação em específico pelo ID

**Estrutura dos dados recebidos**

```json
{
  "transaction": {
    "id": "0490f1b9-4a84-439b-9c29-bbd33fc76447",
    "title": "Transação de teste",
    "amount": 1000,
    "created_at": "2024-10-17 22:14:05",
    "session_id": null
  }
}
```

### GET - retornar resumo da conta

- Rota: `"/transactions/summary"`
- Método: `GET`
- Objetivo: Retornar o resumo do saldo do usuário

**Estrutura dos dados recebida**

```json
{
  "summary": {
    "amount": 2511
  }
}
```

## Como rodar o projeto

1. Instalar as dependências: `npm install`.
2. Executar a criação da tabela executando as migrations: `npm run knex -- migrate:latest`.
3. Acessar o arquivo `.env.example`, criar o arquivo `.env` e configurá-lo de acordo com os exemplos.
4. Inicializar o servidor com `npm run server`.

## Autor

- GitHub - [Felipe Santiago Morais](https://github.com/SantiagoMorais)
- Linkedin - [Felipe Santiago](https://www.linkedin.com/in/felipe-santiago-873025288/)
- Instagram - [@felipe.santiago.morais](https://www.instagram.com/felipe.santiago.morais)
- Email - <a href="mailto:contatofelipesantiago@gmail.com" target="blank">contatofelipesantiago@gmail.com</a>
- <a href="https://api.whatsapp.com/send?phone=5531996951033&text=Hi%2C%20Felipe%21%20I%20got%20your%20contact%20from%20your%20portfolio.">Whatsapp</a>
