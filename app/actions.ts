"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  deleteSession,
  isAuthConfigured,
  requireSession,
  verifyCredentials,
} from "@/lib/auth";
import { allowLoginAttempt } from "@/lib/rate-limit";
import { getDefaultVoucher } from "@/lib/assets.server";

export async function signIn(
  _previous: { error: string },
  form: FormData,
): Promise<{ error: string }> {
  if (!isAuthConfigured())
    return { error: "Sign-in is not configured yet. Please contact the workspace owner." };
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowLoginAttempt(ip))
    return { error: "Too many sign-in attempts. Please try again in 15 minutes." };
  const email = form.get("email");
  const password = form.get("password");
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 254 ||
    password.length > 1024 ||
    !verifyCredentials(email, password)
  ) {
    return { error: "The email or password is incorrect. Please try again." };
  }
  await createSession();
  redirect("/");
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}

export async function restoreDefaults() {
  await requireSession();
  return getDefaultVoucher();
}
