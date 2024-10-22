import fastify from "fastify";
import {
  validatorCompiler,
  ZodTypeProvider,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { createNewTransactionRoute } from "./routes/createNewTransactionRoute.ts";
import { listTransactionsRoute } from "./routes/listTransactionsRoute.ts";
import { getTransactionRoute } from "./routes/getTransactionRoute.ts";
import { accountSummaryRoute } from "./routes/accountSummaryRoute.ts";
import cookie from "@fastify/cookie";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cookie);

app.register(createNewTransactionRoute);
app.register(listTransactionsRoute);
app.register(getTransactionRoute);
app.register(accountSummaryRoute);
