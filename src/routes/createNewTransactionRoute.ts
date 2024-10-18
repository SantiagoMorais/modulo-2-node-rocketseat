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

      // estamos buscando dentro dos cookies da requisição, dentro destes metadados "invisíveis", se já existe uma session_id.

      let sessionId = req.cookies.session_id;

      // Caso já exista, eu passo ela dentro da inserção dos dados.
      if (!sessionId) {
        sessionId = randomUUID();

        // ai eu adiciono dentro do res.cookie um cookie com nome "sessionId", com o valor da nossa variável.
        res.cookie("sessionId", sessionId, {
          // o path define quais rotas do nosso backend podem acessar esses cookies.
          // Se eu adicionar só "/" qualquer rota pode utilizá-lo.
          path: "/",
          // MaxAge define quanto tempo esse cookie deve funcionar no navegador do usuário, em milisegundos
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
