import * as Koa from "koa";
import * as Router from "koa-router";

import { createBnsConnector } from "@iov/bns";
import { config } from "../config";

const routerOpts: Router.IRouterOptions = {
  prefix: "/"
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  ctx.body = "Welcome to IOV Name Service Rest API!";
});

router.get("chain", async (ctx: Koa.Context, next: Function) => {
  await next();
  const connection = await createBnsConnector(config.bnsdTendermintUrl).establishConnection();
  const chainId = connection.chainId();
  ctx.body = { chainId: chainId };
  connection.disconnect();
});

router.get("nodes", async (ctx: Koa.Context) => {
  ctx.body = `BNSD Tendermint Node: ${config.bnsdTendermintHttpUrl} - IOV Faucet Node: ${config.iovFaucet}`;
});

router.get("tokens", async (ctx: Koa.Context, next: Function) => {
  await next();
  const connection = await createBnsConnector(config.bnsdTendermintUrl).establishConnection();
  const allTokens = await connection.getAllTokens();
  ctx.body = { allTokens };
  connection.disconnect();
});

export default router;
