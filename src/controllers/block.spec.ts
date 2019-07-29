import * as supertest from "supertest";
import { app } from "../server";

import { expect } from 'chai';
const request = supertest.agent(app.listen());

describe("Block", () => {
  describe("GET /latest", () => {
    it("should return latest block height", () => {
      return request.get("/block/latest").expect(200).expect(res => {
        expect(res.body.latestBlockHeight).to.be.an('number');
      });
    });
  });
  describe("GET /height", () => {
    it("should return block information based on height", () => {
      const blockHeigth = 2;
      return request.get(`/block/${blockHeigth}`).expect(200).expect(res => {
        expect(res.body.id).to.be.an('string');
        expect(res.body.height).to.be.an('number');
        expect(res.body.height).to.equal(blockHeigth);
        expect(res.body.transactionCount).to.be.an('number');
      });
    });
  });
});
