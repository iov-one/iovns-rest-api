import * as supertest from "supertest";
import { app } from "../server";

const request = supertest.agent(app.listen());

describe("General", () => {
  describe("GET /", () => {
    it("should work return welcome message", () => {
      return request.get("/").expect(200, "Welcome to IOV BNS Server!");
    });
  });
});
