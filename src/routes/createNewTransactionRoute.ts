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

      let sessionId = req.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();
        
        res.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, //7 days
        });
      }

      await knex("transactions").insert({
        id: randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        session_id: sessionId,
      });

      return res.status(201).send();
    }
  );
};
