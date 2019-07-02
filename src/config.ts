const ENVIRONMENT = process.env.NODE_ENV;
const ENV_WHITELIST = ["local", "testnet"];

if (!ENVIRONMENT || ENV_WHITELIST.indexOf(ENVIRONMENT) === -1) {
  throw new Error(`NODE_ENV: must be one of ${ENV_WHITELIST}`);
}

interface IConfig {
  port: number;
  jwtSecret: string;
  bnsdTendermintHttpUrl: string;
  bnsdTendermintUrl: string;
  iovFaucet: string;
}

export const config: IConfig = require(`./env/${ENVIRONMENT}`);
