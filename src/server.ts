import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as helmet from "koa-helmet";

import { config } from "./config";
import generalController from "./controllers/general";
import blockController from "./controllers/block";
import usernameController from "./controllers/username";
import accountController from "./controllers/account";
import transactionController from "./controllers/transaction";

export const app = new Koa();

// Provides important security headers to make your app more secure
app.use(helmet());

// Enable bodyParser with default options
app.use(bodyParser());

// Route middleware.
// General
app.use(generalController.routes());
app.use(generalController.allowedMethods());

// Block
app.use(blockController.routes());
app.use(blockController.allowedMethods());

// Username
app.use(usernameController.routes());
app.use(usernameController.allowedMethods());

// Account
app.use(accountController.routes());
app.use(accountController.allowedMethods());

// Transaction
app.use(transactionController.routes());
app.use(transactionController.allowedMethods());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
