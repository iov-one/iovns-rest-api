import * as Koa from "koa";
import * as Router from "koa-router";
import { bnsCodec, BnsConnection } from "@iov/bns";
import { isBlockInfoPending } from "@iov/bcp";
import { config } from "../config";
import { Encoding } from "@iov/encoding";

const routerOpts: Router.IRouterOptions = {
  prefix: "/username"
};

const router: Router = new Router(routerOpts);

router.get("/:id", async (ctx: Koa.Context) => {
  const username = ctx.params.id;
  const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
  const results = await connection.getUsernames({ username: username });
  if (results.length === 0) {
    // return a BAD REQUEST status code and error message
    ctx.status = 400;
    ctx.body = {
      message: `The username you are trying to retrieve (${username}) doesn't exist in BNS`
    };
  } else {
    // return OK status code and loaded username object
    ctx.status = 200;
    ctx.body = results[0];
  }
  connection.disconnect();
});

router.post("/", async (ctx: Koa.Context) => {
  try {
    const signedTxHex = ctx.request.body;
    const signedTxBytes = JSON.parse(JSON.stringify(signedTxHex));
    
    signedTxBytes.transaction.creator.pubkey.data = Encoding.fromHex(signedTxHex.transaction.creator.pubkey.data);
    signedTxBytes.primarySignature.pubkey.data = Encoding.fromHex(signedTxHex.primarySignature.pubkey.data);
    signedTxBytes.primarySignature.signature = Encoding.fromHex(signedTxHex.primarySignature.signature);
  
    const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
    const response = await connection.postTx(bnsCodec.bytesToPost(signedTxBytes));
    const blockResponse = await response.blockInfo.waitFor(info => !isBlockInfoPending(info));
    connection.disconnect();
    ctx.body = {transactionId: response.transactionId, block: blockResponse};
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: `${e}`
    };
  }
});

router.patch("/", async (ctx: Koa.Context) => {
  try {
    const signedTxHex = ctx.request.body;
    const signedTxBytes = JSON.parse(JSON.stringify(signedTxHex));
    
    signedTxBytes.transaction.creator.pubkey.data = Encoding.fromHex(signedTxHex.transaction.creator.pubkey.data);
    signedTxBytes.primarySignature.pubkey.data = Encoding.fromHex(signedTxHex.primarySignature.pubkey.data);
    signedTxBytes.primarySignature.signature = Encoding.fromHex(signedTxHex.primarySignature.signature);
  
    const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
    const response = await connection.postTx(bnsCodec.bytesToPost(signedTxBytes));
    const blockResponse = await response.blockInfo.waitFor(info => !isBlockInfoPending(info));
    connection.disconnect();
    ctx.body = {transactionId: response.transactionId, block: blockResponse};
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: `${e}`
    };
  }
});

export default router;
