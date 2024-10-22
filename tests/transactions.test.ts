import { afterAll, beforeAll, it, describe, expect } from "vitest";
import { app } from "../src/app.ts";
import request from "supertest";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a new transaction", async () => {
    request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);

    const cookies = createTransactionResponse.get("Set-Cookie");

    if (!cookies) return;
    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "new transaction",
        amount: 5000,
      }),
    ]);
  });
});
