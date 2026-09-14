import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "upavan-session";
const SESSION_SECONDS = 60 * 60 * 12;

function config() {
  const email = process.env.AUTH_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.AUTH_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || secret.length < 32)
    return null;
  return { email, password, key: new TextEncoder().encode(secret) };
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function credentialVersion(email: string, password: string) {
  return createHash("sha256")
    .update(JSON.stringify([email, password]))
    .digest("hex");
}

export function isAuthConfigured() {
  return config() !== null;
}

export function verifyCredentials(email: string, password: string) {
  const settings = config();
  if (!settings) return false;
  const emailMatches = timingSafeEqual(digest(email.trim().toLowerCase()), digest(settings.email));
  const passwordMatches = timingSafeEqual(digest(password), digest(settings.password));
  return emailMatches && passwordMatches;
}

export async function createSession() {
  const settings = config();
  if (!settings) throw new Error("Sign-in is not configured.");
  const token = await new SignJWT({ version: credentialVersion(settings.email, settings.password) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(settings.email)
    .setIssuer("upavan-voucher")
    .setAudience("upavan-designer")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(settings.key);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function getSession() {
  const settings = config();
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!settings || !token) return null;
  try {
    const { payload } = await jwtVerify(token, settings.key, {
      algorithms: ["HS256"],
      issuer: "upavan-voucher",
      audience: "upavan-designer",
    });
    if (
      payload.sub !== settings.email ||
      payload.version !== credentialVersion(settings.email, settings.password)
    )
      return null;
    return { email: settings.email };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}
