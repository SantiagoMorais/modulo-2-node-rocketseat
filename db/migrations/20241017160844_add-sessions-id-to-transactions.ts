import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // ao invez de usar o createTable, usamos o alterTable
  // after: indica onde ele ficará posicionado
  // index: criar um índice nesse campo da tabela = uma forma de falar ao db que vamos fazer muitas buscas em transações específicas em um id de uma sessão.
  // Dizendo que vamos fazer muitas buscas usand oo "where" para o "sessions_id"
  await knex.schema.alterTable("transactions", (table) => {
    table.uuid("session_id").after("id").index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("transactions", (table) => {
    // Se eu criei, aqui preciso remover a coluna
    table.dropColumn("session_id");
  });
}
