import * as supertest from "supertest";
import { app } from "../server";

import { expect } from 'chai';
const request = supertest.agent(app.listen());

describe("General", () => {
  describe("GET /", () => {
    it("should return welcome message", () => {
      return request.get("/").expect(200, "Welcome to IOV BNS Server!");
    });
  });
  describe("GET /chain", () => {
    it("should return chain id", () => {
      return request.get("/chain").expect(200).expect(res => {
        expect(res.body.chainId).to.be.an('string');
      });
    });
  });
});
