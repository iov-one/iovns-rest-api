import * as Koa from "koa";
import * as Router from "koa-router";
import { BnsConnection } from "@iov/bns";

import { config } from "../config";

const routerOpts: Router.IRouterOptions = {
  prefix: "/username"
};

const router: Router = new Router(routerOpts);

router.get("/:id", async (ctx: Koa.Context) => {
  const username = ctx.params.id;
  const connection = await BnsConnection.establish(config.bnsdTendermintUrl);
  const results = await connection.getUsernames({ username: username });
  ctx.body = results;
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

export default router;
