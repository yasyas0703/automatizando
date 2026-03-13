import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nextlaser-secret-key-2024"
);

// Único usuário — senha em hash bcrypt
const USER = {
  email: "admin@nextlaser.com",
  passwordHash: "$2b$10$9DbuFxKy14REhoplvh25ieKvzyfXYHoLxVXR26BrDO4WBID1SzwI2", // nextlaserfy
};

export async function authenticate(email: string, password: string): Promise<string | null> {
  if (email !== USER.email) return null;

  const valid = await bcrypt.compare(password, USER.passwordHash);
  if (!valid) return null;

  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
