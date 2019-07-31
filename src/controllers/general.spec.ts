import * as supertest from "supertest";
import { app } from "../server";
import { config } from "../config";

import { expect } from 'chai';
const request = supertest.agent(app.listen());

describe("General", () => {
  describe("GET /", () => {
    it("should return welcome message", () => {
      return request.get("/").expect(200, "Welcome to IOV Name Service Rest API!");
    });
  });
  describe("GET /chain", () => {
    it("should return chain id", () => {
      return request.get("/chain").expect(200).expect(res => {
        expect(res.body.chainId).to.be.an('string');
      });
    });
  });
  describe("GET /nodes", () => {
    it("should return tendermint and faucet urls", () => {
      return request.get("/nodes").expect(200, `BNSD Tendermint Node: ${config.bnsdTendermintHttpUrl} - IOV Faucet Node: ${config.iovFaucet}`);
    });
  });
  describe("GET /tokens", () => {
    it("should return all tokens", () => {
      return request.get("/tokens").expect(200).expect(res => {
        expect(res.body.allTokens).to.be.an('array');
        expect(res.body.allTokens.length).to.be.greaterThan(0);
      });
    });
  });
});
