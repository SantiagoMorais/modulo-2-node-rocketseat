import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { knex } from "../database.ts";

export const accountSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/transactions/summary", async (req, res) => {
    const summary = await knex("transactions")
      .sum("amount", { as: "amount" })
      .first();

    return res.status(200).send({ summary });
  });
};
