import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { knex } from "../database.ts";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.ts";

export const listTransactionsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/transactions",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const sessionId = req.cookies.sessionId;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      return res.status(200).send({ total: transactions.length, transactions });
    }
  );
};
