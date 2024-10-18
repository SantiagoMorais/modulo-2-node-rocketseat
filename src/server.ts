import fastify from "fastify";
import { env } from "./env/index.ts";
import {
  validatorCompiler,
  ZodTypeProvider,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { createNewTransactionRoute } from "./routes/createNewTransactionRoute.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createNewTransactionRoute);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
