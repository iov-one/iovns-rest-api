export const port = +process.env.PORT || 3000;
export const jwtSecret = process.env.JWT_SECRET || "your-secret-here";
export const bnsdTendermintHttpUrl = process.env.BNSD_NODE_HTTP_URL || "http://localhost:23456";
export const bnsdTendermintUrl = process.env.BNSD_NODE_URL || "ws://localhost:23456";
export const iovFaucet = process.env.IOV_FAUCET || "http://localhost:8000";
