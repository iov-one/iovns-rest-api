export const port = +process.env.PORT || 8080;
export const jwtSecret = process.env.JWT_SECRET || "your-secret-here";
export const bnsdTendermintHttpUrl = process.env.BNSD_NODE_HTTP_URL || "https://rpc-private-a-vip2-clapnet.iov.one/";
export const bnsdTendermintUrl = process.env.BNSD_NODE_URL || "wss://rpc-private-a-vip2-clapnet.iov.one";
export const iovFaucet = process.env.IOV_FAUCET || "to-be-done";
