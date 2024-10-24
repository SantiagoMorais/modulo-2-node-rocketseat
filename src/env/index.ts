import { z } from "zod";
import { config } from "dotenv";

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
config({ path: envPath });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(["sqlite", 'pg']),
  TEST_DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables!");
}

export const env = _env.data;