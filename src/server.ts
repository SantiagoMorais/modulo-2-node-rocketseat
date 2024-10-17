import fastify from "fastify";
import { knex } from "./database.js";

const app = fastify();
const port = 3333;

app.get("/hello", async () => {
  const test = await knex("sqlite_schema").select("*")
  return test
});

app.listen({ port }).then(() => {
  console.log(`Server running on http://localhost:${port}`);
});
