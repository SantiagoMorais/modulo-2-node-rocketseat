import { app } from "./app.ts";
import { env } from "./env/index.ts";

// separar o app do servidor

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
