import fastify from "fastify";
import { knex } from "./database.js";

const app = fastify();
const port = 3333;

app.get("/hello", async () => {
  const transactions = await knex("transactions")
    .where("amount", 1000)
    .select("*");

  return transactions;
});

app.listen({ port }).then(() => {
  console.log(`Server running on http://localhost:${port}`);
});
