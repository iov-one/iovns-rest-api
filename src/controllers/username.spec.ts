import * as supertest from "supertest";
import { ChainId, isBlockInfoPending, TokenTicker, WithCreator } from "@iov/bcp";
import { bnsConnector, bnsCodec, RegisterUsernameTx } from "@iov/bns";
import { Random } from "@iov/crypto";
import { MultiChainSigner } from "@iov/multichain";
import { Ed25519HdWallet, HdPaths, UserProfile } from "@iov/keycontrol";
import { IovFaucet } from "@iov/faucets";
import { Encoding } from "@iov/encoding";

import { config } from "../config";
import { app } from "../server";

import { expect } from 'chai';

const request = supertest.agent(app.listen());

describe("Username", () => {
  describe("GET /username", () => {
    it("should return username does not exists", () => {
      return request.get("/username/user-does-not-exists").expect(400, {
        message:
          "The username you are trying to retrieve (user-does-not-exists) doesn't exist in BNS"
      });
    });
    it("should return username data", async () => {
      const profile = new UserProfile();
      const signer = new MultiChainSigner(profile);
      const { connection } = await signer.addChain(bnsConnector(config.bnsdTendermintUrl));
      const chainId = connection.chainId();

      const wallet = profile.addWallet(
        Ed25519HdWallet.fromEntropy(await Random.getBytes(32))
      );
      const identity = await profile.createIdentity(wallet.id, chainId as ChainId, HdPaths.iov(0));
      const identityAddress = signer.identityToAddress(identity);
      const faucet = new IovFaucet(config.iovFaucet);
      await faucet.credit(identityAddress, "CASH" as TokenTicker);

      // Register username
      const username = `bns-p_test-un_${Math.random().toString(36).substring(2)}*iov`;
      console.log("username created:", username);
      const registration = await connection.withDefaultFee<RegisterUsernameTx & WithCreator>({
        kind: "bns/register_username",
        creator: identity,
        username: username,
        targets: [{ chainId: chainId, address: identityAddress }],
      });
      const nonce = await connection.getNonce({ pubkey: identity.pubkey });
      const signed = await profile.signTransaction(
        registration,
        bnsCodec,
        nonce
      );
      {
        const response = await connection.postTx(bnsCodec.bytesToPost(signed));
        await response.blockInfo.waitFor(info => !isBlockInfoPending(info));
      }
      connection.disconnect();
      return request.get(`/username/${username}`).expect(200).expect(res => {
        expect(res.body.id).to.be.equal(username);
        expect(res.body.owner).to.be.equal(identityAddress);
      });
    });
  });
  describe("POST /username", () => {
    it("should create username", async () => {
      const profile = new UserProfile();
      const signer = new MultiChainSigner(profile);
      const { connection } = await signer.addChain(bnsConnector(config.bnsdTendermintUrl));
      const chainId = connection.chainId();

      const wallet = profile.addWallet(
        Ed25519HdWallet.fromEntropy(await Random.getBytes(32))
      );
      const identity = await profile.createIdentity(wallet.id, chainId as ChainId, HdPaths.iov(0));
      const identityAddress = signer.identityToAddress(identity);
      const faucet = new IovFaucet(config.iovFaucet);
      await faucet.credit(identityAddress, "CASH" as TokenTicker);

      // Register username
      const username = `bns-p_test-un_${Math.random().toString(36).substring(2)}*iov`;
      console.log("username created:", username);
      const registration = await connection.withDefaultFee<RegisterUsernameTx & WithCreator>({
        kind: "bns/register_username",
        creator: identity,
        username: username,
        targets: [{ chainId: chainId, address: identityAddress }],
      });
      const nonce = await connection.getNonce({ pubkey: identity.pubkey });
      connection.disconnect();
      const signed = await profile.signTransaction(
        registration,
        bnsCodec,
        nonce
      );

      const signedHex = JSON.parse(JSON.stringify(signed));
      signedHex.transaction.creator.pubkey.data = Encoding.toHex(signed.transaction.creator.pubkey.data);
      signedHex.primarySignature.pubkey.data = Encoding.toHex(signed.primarySignature.pubkey.data);
      signedHex.primarySignature.signature = Encoding.toHex(signed.primarySignature.signature);
      console.log("signedHex create username", signedHex);
      return request.post("/username").send(signedHex).expect(200).expect(res => {
        expect(res.body.transactionId).to.be.an('string');
        expect(res.body.block).to.be.an('object');
      });
    });
  });
});
