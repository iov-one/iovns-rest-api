import * as Koa from "koa";
import * as Router from "koa-router";

import { createBnsConnector } from "@iov/bns";
import { config } from "../config";

const routerOpts: Router.IRouterOptions = {
  prefix: "/block"
};

const router: Router = new Router(routerOpts);

router.get("/latest", async (ctx: Koa.Context) => {
  const connection = await createBnsConnector(config.bnsdTendermintUrl).establishConnection();
  const latestBlockHeight = await connection.height();
  ctx.body = { latestBlockHeight} ;
  connection.disconnect();
});

router.get("/:height", async (ctx: Koa.Context) => {
  const blockHeight: number = Number(ctx.params.height);
  const connection = await createBnsConnector(config.bnsdTendermintUrl).establishConnection();
  const blockHeader = await connection.getBlockHeader(blockHeight);
  ctx.body = blockHeader;
  connection.disconnect();
});

export default router;
