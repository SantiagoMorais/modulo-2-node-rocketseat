import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { knex } from "../database.ts";
import { randomUUID } from "crypto";

export const createNewTransactionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/transactions",
    {
      schema: {
        body: z.object({
          title: z.string().min(2).max(30),
          amount: z.number().min(0.1),
          type: z.enum(["credit", "debit"]),
        }),
      },
    },
    async (req, res) => {
      const { amount, title, type } = req.body;

      await knex("transactions").insert({
        id: randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
      });

      return res
        .status(201)
        .send();
    }
  );
};
