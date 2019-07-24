import * as supertest from "supertest";
import { Address, ChainId, TokenTicker, SendTransaction, WithCreator } from "@iov/bcp";
import { bnsConnector, bnsCodec } from "@iov/bns";
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

describe("Transaction", () => {
  describe("POST /transaction", () => {
    it("should send a transaction", async () => {
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
      await faucet.credit(identityAddress, token);
      // console.log("sender identityAddress", identityAddress);
      const rcptAddress = await randomBnsAddress();

      const sendTx = await connection.withDefaultFee<SendTransaction & WithCreator>({
        kind: "bcp/send",
        creator: identity,
        sender: identityAddress,
        recipient: rcptAddress,
        memo: "My first payment from IOV BNS-Proxy",
        amount: {
          quantity: "1000053000",
          fractionalDigits: 9,
          tokenTicker: token,
        }
      });
      const nonce = await connection.getNonce({ pubkey: identity.pubkey });
      connection.disconnect();
      const signed = await profile.signTransaction(
        sendTx,
        bnsCodec,
        nonce
      );

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
});
