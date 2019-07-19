import * as Koa from "koa";
import * as Router from "koa-router";
import { BnsConnection } from "@iov/bns";
import { Algorithm, PubkeyBytes, PubkeyBundle } from "@iov/bcp";
import { Encoding } from "@iov/encoding";

import { config } from "../config";

const routerOpts: Router.IRouterOptions = {
  prefix: "/account"
};

const router: Router = new Router(routerOpts);

// Address
router.get("/address/:owner", async (ctx: Koa.Context) => {
  try {
    const identityAddress = ctx.params.owner;
    const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
    const results = await connection.getUsernames({ owner: identityAddress });
    ctx.body = results;
    if (results.length === 0) {
      // return a BAD REQUEST status code and error message
      ctx.status = 400;
      ctx.body = {
        message: `The address you are trying to retrieve information (${identityAddress}) doesn't exist in BNS`
      };
    } else {
      // return OK status code and loaded username object
      ctx.status = 200;
      ctx.body = results[0];
    }
    connection.disconnect();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: `${e}`
    };
  }
});

router.get("/address/balance/:owner", async (ctx: Koa.Context) => {
  try {
    const identityAddress = ctx.params.owner;
    const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
    const results = await connection.getAccount({ address: identityAddress });
    ctx.body = results;
    if (results === null) {
      // return a BAD REQUEST status code and error message
      ctx.status = 400;
      ctx.body = {
        message: `The address you are trying to retrieve balance (${identityAddress}) doesn't exist in BNS`
      };
    } else {
      // return OK status code and loaded username object
      ctx.status = 200;
      ctx.body = results;
    }
    connection.disconnect();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: `${e}`
    };
  }
});

router.get("/address/nonce/:owner", async (ctx: Koa.Context) => {
  try {
    const identityAddress = ctx.params.owner;
    const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
    const nonce = await connection.getNonce({ address: identityAddress });
    ctx.body = {nonce: nonce};
    connection.disconnect();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: `${e}`
    };
  }
});

// Pubkey
router.get("/pubkey/nonce/:owner", async (ctx: Koa.Context) => {
  try {
    const pubkeyBytes = Encoding.fromHex(ctx.params.owner) as PubkeyBytes;
    const identityPubkeyBundle: PubkeyBundle = { 
      algo: Algorithm.Ed25519,
      data: pubkeyBytes 
    };
    const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
    const nonce = await connection.getNonce({ pubkey: identityPubkeyBundle });
    ctx.body = {nonce: nonce};
    connection.disconnect();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      message: `${e}`
    };
  }
});

export default router;
