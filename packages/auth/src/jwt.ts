import jwt from "jsonwebtoken";
import { User } from "@gcp/contracts";

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-jwt-secret-key-32-chars-minimum-safe";
const JWT_EXPIRES_IN = "24h";

export interface JwtTokenPayload {
  sub: string; // User ID
  email: string;
  role: string;
  tenantId: string | null;
  branchId: string | null;
  name: string;
}

export function issueAccessToken(user: User): string {
  const payload: JwtTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    branchId: user.branchId,
    name: user.fullName,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "gcp-auth-engine",
    audience: "gcp-apps",
  });
}

export function verifyAccessToken(token: string): JwtTokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "gcp-auth-engine",
      audience: "gcp-apps",
    }) as JwtTokenPayload;
  } catch (err: any) {
    throw new Error(`Invalid access token: ${err.message}`);
  }
}
