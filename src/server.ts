import fastify from "fastify";
import { knex } from "./database.js";
import { env } from "./env/index.ts";

const app = fastify();

app.get("/hello", async () => {
  const transactions = await knex("transactions")
    .where("amount", 1000)
    .select("*");

  return transactions;
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
