import { afterAll, beforeAll, it } from "vitest";
import { app } from "../src/app.ts";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

it("should user be able to create a new transaction", async () => {
  await request(app.server)
    .post("/transactions")
    .send({
      title: "new transaction",
      amount: 5000,
      type: "credit",
    })
    .expect(201);
});
