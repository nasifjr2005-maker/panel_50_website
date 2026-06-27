import type { AdminStore } from "@/lib/admin-types";

const backupPath = process.env.GITHUB_BACKUP_PATH || "backups/admin-store.json";

type BackupStatus = {
  enabled: boolean;
  message: string;
};

let lastBackupStatus: BackupStatus = {
  enabled: Boolean(process.env.GITHUB_BACKUP_TOKEN && process.env.GITHUB_BACKUP_REPO),
  message: ""
};

function backupConfig() {
  const token = process.env.GITHUB_BACKUP_TOKEN;
  const repo = process.env.GITHUB_BACKUP_REPO;
  const branch = process.env.GITHUB_BACKUP_BRANCH || "main";
  if (!token || !repo) {
    return null;
  }

  return { token, repo, branch };
}

function backupPayload(store: AdminStore) {
  const snapshot = {
    categories: store.categories,
    media: store.media,
    content: store.content,
    settings: store.settings,
    faqs: store.faqs,
    testimonials: store.testimonials,
    communityLinks: store.communityLinks,
    recentUpdates: store.recentUpdates
  };

  return JSON.stringify({
    backedUpAt: new Date().toISOString(),
    snapshot
  }, null, 2);
}

function toBase64(input: string) {
  return Buffer.from(input, "utf8").toString("base64");
}

async function getExistingFileSha(config: { token: string; repo: string; branch: string }) {
  const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/${backupPath}?ref=${encodeURIComponent(config.branch)}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "panel-50-admin-backup"
    },
    cache: "no-store"
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`GitHub backup lookup failed: ${response.status}`);
  }

  const data = await response.json();
  return typeof data.sha === "string" ? data.sha : undefined;
}

export function getGitHubBackupStatus() {
  return {
    ...lastBackupStatus,
    path: backupPath
  };
}

export async function backupAdminStoreToGitHub(store: AdminStore) {
  const config = backupConfig();
  if (!config) {
    lastBackupStatus = {
      enabled: false,
      message: "GitHub backup is disabled. Set GITHUB_BACKUP_TOKEN and GITHUB_BACKUP_REPO to back up admin edits."
    };
    return;
  }

  try {
    const sha = await getExistingFileSha(config);
    const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/${backupPath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "panel-50-admin-backup"
      },
      body: JSON.stringify({
        message: `Backup admin store ${new Date().toISOString()}`,
        content: toBase64(backupPayload(store)),
        branch: config.branch,
        sha
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub backup upload failed: ${response.status}`);
    }

    lastBackupStatus = {
      enabled: true,
      message: `Last GitHub backup saved to ${config.repo}/${backupPath}.`
    };
  } catch (error) {
    lastBackupStatus = {
      enabled: true,
      message: error instanceof Error ? error.message : "GitHub backup failed."
    };
    console.error("GitHub admin backup failed.", error);
  }
}
