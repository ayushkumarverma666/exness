const isProd = process.env.NODE_ENV === "production";

const jwtSecret = process.env.JWT_SECRET;
if (isProd && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error("JWT_SECRET must be set to at least 32 characters in production");
}

export const config = {
  port: Number(process.env.PORT || 3001),
  isProd,
  jwtSecret: jwtSecret || "dev-only-insecure-secret-change-me-0000",
  jwtExpiresIn: "7d" as const,
  sessionMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  // Same-origin deployments (web + API behind one domain) can use "lax";
  // a web app on a different domain needs "none".
  cookieSameSite: (process.env.COOKIE_SAMESITE || "lax") as "lax" | "strict" | "none",
  cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === "true" : isProd,
  corsOrigins: [
    "http://localhost:3000",
    "http://localhost:3200",
    ...(process.env.CORS_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ],
  upstreamApi: process.env.MARKET_DATA_API || "https://api.backpack.exchange/api/v1",
};
