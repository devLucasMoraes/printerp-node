export const authConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "access_secret",
  accessTokenExpiration: "15m",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret",
  refreshTokenExpiration: "7d",
  accessTokenCookieName: "token",
  refreshTokenCookieName: "refreshToken",
  refreshTokenCookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  saltRounds: 8,
} as const;
