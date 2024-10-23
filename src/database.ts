import setupKnex from "knex";
import type { Knex } from "knex";
import "dotenv/config";
import { env } from "./env/index.ts";

const dbConnection =
  env.DATABASE_CLIENT === "sqlite"
    ? {
        filename:
          env.NODE_ENV === "test" ? env.TEST_DATABASE_URL : env.DATABASE_URL,
      }
    : env.DATABASE_URL;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: dbConnection,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
