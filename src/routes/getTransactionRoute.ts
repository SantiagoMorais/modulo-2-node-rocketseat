import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { knex } from "../database.ts";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.ts";

export const getTransactionRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/transactions/:id",
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const { id } = req.params;
      const sessionId = req.cookies.sessionId;

      const transaction = await knex("transactions")
        .where({
          session_id: sessionId,
          id,
        })
        .first();

      if (!transaction)
        return res
          .status(404)
          .send({ message: "Transaction not found. Please check its ID" });

      return res.status(200).send({ transaction });
    }
  );
};
