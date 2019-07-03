import * as Koa from "koa";
import * as Router from "koa-router";

import { bnsConnector } from "@iov/bns";
import { config } from "../config";

const routerOpts: Router.IRouterOptions = {
  prefix: "/"
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  ctx.body = "Welcome to IOV BNS Server!";
});

router.get("chain", async (ctx: Koa.Context, next: Function) => {
  await next();
  const connection = await bnsConnector(config.bnsdTendermintUrl).client();
  const chainId = connection.chainId();
  ctx.body = { chainId: chainId };
  connection.disconnect();
});

export default router;
