import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table.text("title").notNullable();
    // 10 é o tamanho do número que quero armazenar e 2 é o número de casas decimais
    table.decimal("amount", 10, 2).notNullable();
    // timestam: anota a data de quando cada registro foi criado.
    // O valor default de cada banco é diferente, alguns são CURRENT, outros NOW, etc.
    // Para que possamos mudar para qualquer banco usando o knex, usamos o knex.fn.now()
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
