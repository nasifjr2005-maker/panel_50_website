import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const sessionCookieName = "panel50_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "panel50-dev-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionValue(username: string, timeoutMinutes = 480, sessionId = "session") {
  const expires = Date.now() + timeoutMinutes * 60 * 1000;
  const payload = `${username}.${expires}.${sessionId}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) {
    return false;
  }

  const parts = value.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}.${parts[2]}`;
  const expected = sign(payload);
  const received = parts[3];

  try {
    const validSignature = timingSafeEqual(Buffer.from(expected), Buffer.from(received));
    return validSignature && Number(parts[1]) > Date.now();
  } catch {
    return false;
  }
}

export async function setAdminSession(username: string, timeoutMinutes: number, sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, createSessionValue(username, timeoutMinutes, sessionId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(sessionCookieName)?.value);
}

export { sessionCookieName };
