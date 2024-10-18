import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { knex } from "../database.ts";

export const listTransactionsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/transactions", async (_, res) => {
    const transactions = await knex("transactions").select();

    return res.status(200).send({ total: transactions.length, transactions });
  });
};
