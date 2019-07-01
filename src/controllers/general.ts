import * as Koa from "koa";
import * as Router from "koa-router";

const routerOpts: Router.IRouterOptions = {
  prefix: "/"
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  ctx.body = "Welcome to IOV BNS Server!";
});

export default router;
