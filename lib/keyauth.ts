import { createHash } from "crypto";

type KeyAuthInitResponse = {
  success?: boolean;
  message?: string;
  sessionid?: string;
};

type KeyAuthLoginResponse = {
  success?: boolean;
  message?: string;
  info?: {
    username?: string;
    expires?: string;
    subscriptions?: Array<{ subscription?: string; expiry?: string }>;
  };
};

const keyAuthEndpoint = "https://keyauth.win/api/1.3/";

function getKeyAuthConfig() {
  return {
    enabled: (process.env.KEYAUTH_ENABLED || "true").toLowerCase() !== "false",
    name: process.env.KEYAUTH_APP_NAME || "FERO PANEL NO1",
    ownerId: process.env.KEYAUTH_OWNER_ID || "P0K7bR4FLL",
    version: process.env.KEYAUTH_APP_VERSION || "1.0",
    secret: process.env.KEYAUTH_APP_SECRET || ""
  };
}

function buildUrl(params: Record<string, string>) {
  const url = new URL(keyAuthEndpoint);
  url.search = new URLSearchParams(params).toString();
  return url;
}

async function fetchKeyAuth<T>(params: Record<string, string>) {
  const controller = new AbortController();
  const timeout = windowlessTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(buildUrl(params), {
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      return { success: false, message: `KeyAuth HTTP ${response.status}` } as T;
    }

    return await response.json() as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : "KeyAuth request failed";
    return { success: false, message } as T;
  } finally {
    clearTimeout(timeout);
  }
}

function windowlessTimeout(callback: () => void, ms: number) {
  return setTimeout(callback, ms);
}

function buildStableWebHwid(username: string, ownerId: string, deviceHwid?: string) {
  const configuredHwid = process.env.KEYAUTH_ADMIN_HWID;
  if (configuredHwid) {
    return configuredHwid;
  }

  if (/^[a-f0-9]{32,128}$/i.test(deviceHwid || "")) {
    return deviceHwid as string;
  }

  return createHash("sha256").update(`panel50-web-admin:${ownerId}:${username.trim().toLowerCase()}`).digest("hex").slice(0, 32);
}

export async function verifyKeyAuthLogin(username: string, password: string, deviceHwid?: string) {
  const config = getKeyAuthConfig();

  if (!config.enabled || !config.name || !config.ownerId || !config.version || !username || !password) {
    return { success: false, message: "KeyAuth is not configured" };
  }

  const initResponse = await fetchKeyAuth<KeyAuthInitResponse>({
    type: "init",
    name: config.name,
    ownerid: config.ownerId,
    ver: config.version
  });

  if (!initResponse.success || !initResponse.sessionid) {
    return { success: false, message: initResponse.message || "KeyAuth initialization failed" };
  }

  const loginResponse = await fetchKeyAuth<KeyAuthLoginResponse>({
    type: "login",
    username,
    pass: password,
    name: config.name,
    ownerid: config.ownerId,
    sessionid: initResponse.sessionid,
    hwid: buildStableWebHwid(username, config.ownerId, deviceHwid)
  });

  return {
    success: Boolean(loginResponse.success),
    message: loginResponse.message || (loginResponse.success ? "KeyAuth login accepted" : "KeyAuth login rejected"),
    username: loginResponse.info?.username || username
  };
}
