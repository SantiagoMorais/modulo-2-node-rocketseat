import setupKnex from "knex";
import type { Knex } from "knex";
import "dotenv/config";
import { env } from "./env/index.ts";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
