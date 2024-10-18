import { FastifyInstance } from "fastify";
import { knex } from "../database.ts";

// Para criarmos um plugin do fastify eles precisam obrigatoriamente ser assíncronos
export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get("/hello", async () => {
    const transactions = await knex("transactions")
      .where("amount", 1000)
      .select("*");

    return transactions;
  });
};
