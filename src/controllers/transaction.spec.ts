import * as supertest from "supertest";
import { Address, ChainId, isBlockInfoPending, TokenTicker, SendTransaction, WithCreator } from "@iov/bcp";
import { createBnsConnector, bnsCodec } from "@iov/bns";
import { Random } from "@iov/crypto";
import { MultiChainSigner } from "@iov/multichain";
import { Ed25519HdWallet, HdPaths, UserProfile } from "@iov/keycontrol";
import { IovFaucet } from "@iov/faucets";
import { Bech32, Encoding } from "@iov/encoding";

import { config } from "../config";
import { app } from "../server";

import { expect } from 'chai';

const request = supertest.agent(app.listen());
const token = process.env.TOKEN as TokenTicker;

async function randomBnsAddress(): Promise<Address> {
  return Bech32.encode("tiov", await Random.getBytes(20)) as Address;
}

async function createAndSignTx() {
  const profile = new UserProfile();
  const signer = new MultiChainSigner(profile);
  const { connection } = await signer.addChain(createBnsConnector(config.bnsdTendermintUrl));
  const chainId = connection.chainId();

  const wallet = profile.addWallet(
    Ed25519HdWallet.fromEntropy(await Random.getBytes(32))
  );
  const identity = await profile.createIdentity(wallet.id, chainId as ChainId, HdPaths.iov(0));
  const senderAddress = signer.identityToAddress(identity);
  const faucet = new IovFaucet(config.iovFaucet);
  await faucet.credit(senderAddress, token);
  // console.log("sender senderAddress", senderAddress);
  const rcptAddress = await randomBnsAddress();
  const txTimeStamp = Date.now();

  const sendTx = await connection.withDefaultFee<SendTransaction & WithCreator>({
    kind: "bcp/send",
    creator: identity,
    sender: senderAddress,
    recipient: rcptAddress,
    memo: `BNS-Proxy tx ${txTimeStamp}`,
    amount: {
      quantity: "1000053000",
      fractionalDigits: 9,
      tokenTicker: token,
    }
  });
  const nonce = await connection.getNonce({ pubkey: identity.pubkey });
  const signed = await profile.signTransaction(
    sendTx,
    bnsCodec,
    nonce
  );
  return {signed, connection, senderAddress, rcptAddress};
}

describe("Transaction", () => {
  describe("POST /transaction", () => {
    it("should send a transaction", async () => {
      const {connection, signed} = await createAndSignTx();
      connection.disconnect();
      const signedHex = JSON.parse(JSON.stringify(signed));
      signedHex.transaction.creator.pubkey.data = Encoding.toHex(signed.transaction.creator.pubkey.data);
      signedHex.primarySignature.pubkey.data = Encoding.toHex(signed.primarySignature.pubkey.data);
      signedHex.primarySignature.signature = Encoding.toHex(signed.primarySignature.signature);
      // console.log("signedHex send transaction", signedHex);
      return request.post("/transaction").send(signedHex).expect(200).expect(res => {
        expect(res.body.transactionId).to.be.an('string');
        expect(res.body.block).to.be.an('object');
      });
    });
  });
  describe("GET /", () => {
    describe("by transaction id", () => {
      it("should return error when tx id does not exists", () => {
        const txIdInvalid = 'abcd';
        return request.get(`/transaction?id=${txIdInvalid}`).expect(200).expect(res => {
          expect(res.body.length).to.be.equal(0);
        });
      });
      it("should return transaction information based on transaction id", async () => {
        const {connection, signed} = await createAndSignTx();
        const response = await connection.postTx(bnsCodec.bytesToPost(signed));
        await response.blockInfo.waitFor(info => !isBlockInfoPending(info));
        const transactionId = response.transactionId;
        connection.disconnect();
        return request.get(`/transaction?id=${transactionId}`).expect(200).expect(res => {
          expect(res.body[0].transactionId).to.be.equal(transactionId);
        });
      });
    });
    describe("by user address", () => {
      it("should return error when user address does not exists", async () => {
        const randomUserAddress = await randomBnsAddress();
        return request.get(`/transaction?sentFromOrTo=${randomUserAddress}`).expect(200).expect(res => {
          expect(res.body.length).to.be.equal(0);
        });
      });
      it("should return transactions list based on user address", async () => {
        const {connection, signed, senderAddress} = await createAndSignTx();
        const response = await connection.postTx(bnsCodec.bytesToPost(signed));
        await response.blockInfo.waitFor(info => !isBlockInfoPending(info));
        const transactionId = response.transactionId;
        connection.disconnect();
        return request.get(`/transaction?sentFromOrTo=${senderAddress}`).expect(200).expect(res => {
          expect(res.body.length).to.be.greaterThan(1);
          expect(res.body[res.body.length - 1].transactionId).to.be.equal(transactionId);
        });
      });
    });
  });
});
