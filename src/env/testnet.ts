export const port = +process.env.PORT || 3000;
export const jwtSecret = process.env.JWT_SECRET || "your-secret-here";
export const bnsdTendermintHttpUrl =
  process.env.BNSD_NODE_HTTP_URL || "https://bns.hugnet.iov.one/";
export const bnsdTendermintUrl =
  process.env.BNSD_NODE_URL || "wss://bns.hugnet.iov.one";
