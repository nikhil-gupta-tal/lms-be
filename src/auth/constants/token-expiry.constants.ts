import { JwtSignOptions } from "@nestjs/jwt";

interface TokenExpiryEntry {
  ms: number;
  jwt: JwtSignOptions["expiresIn"];
}

export const TokenExpiry: Record<string, TokenExpiryEntry> = {
  access: { ms: 1 * 60 * 60 * 1000, jwt: "1h" },
  refresh: { ms: 7 * 24 * 60 * 60 * 1000, jwt: "7d" },
  default: { ms: 24 * 60 * 60 * 1000, jwt: "1d" },
};
