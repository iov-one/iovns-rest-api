import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as helmet from "koa-helmet";

import { config } from "./config";
import generalController from "./controllers/general";
import usernameController from "./controllers/username";

export const app = new Koa();

// Provides important security headers to make your app more secure
app.use(helmet());

// Enable bodyParser with default options
app.use(bodyParser());

// Route middleware.
// General
app.use(generalController.routes());
app.use(generalController.allowedMethods());
// Username
app.use(usernameController.routes());
app.use(usernameController.allowedMethods());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
