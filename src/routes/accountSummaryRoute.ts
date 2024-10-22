import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { knex } from "../database.ts";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.ts";

export const accountSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/transactions/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const sessionId = req.cookies.sessionId;

      const summary = await knex("transactions")
        .where("session_id", sessionId )
        .sum("amount", { as: "amount" })
        .first();

      return res.status(200).send({ summary });
    }
  );
};
