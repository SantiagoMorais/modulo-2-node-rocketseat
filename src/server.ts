import fastify from "fastify";
import { env } from "./env/index.ts";
import {
  validatorCompiler,
  ZodTypeProvider,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { createNewTransactionRoute } from "./routes/createNewTransactionRoute.ts";
import { listTransactionsRoute } from "./routes/listTransactionsRoute.ts";
import { getTransactionRoute } from "./routes/getTransactionRoute.ts";
import { accountSummaryRoute } from "./routes/accountSummaryRoute.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createNewTransactionRoute);
app.register(listTransactionsRoute);
app.register(getTransactionRoute);
app.register(accountSummaryRoute);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
