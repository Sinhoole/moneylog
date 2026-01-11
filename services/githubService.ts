
import { AppData, GitHubConfig, DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from '../types';

const BASE_URL = 'https://api.github.com';
const FILE_PATH = 'data.json';
const BRANCH = 'main';
const LOCAL_STORAGE_KEY = 'zenledger_local_data';

export const validateToken = async (token: string): Promise<string | null> => {
  if (token === 'local') return 'local-user';
  try {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: `token ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.login; // Return username
  } catch (e) {
    return null;
  }
};

export const createRepo = async (token: string, repoName: string): Promise<boolean> => {
  if (token === 'local') return true;
  try {
    const res = await fetch(`${BASE_URL}/user/repos`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        private: true,
        description: 'ZenLedger AI Data Store',
        auto_init: true,
      }),
    });
    return res.ok || res.status === 422; // 422 means already exists
  } catch (e) {
    return false;
  }
};

export const getLedgerData = async (config: GitHubConfig): Promise<{ data: AppData; sha: string } | null> => {
  // Local Mode: Load from LocalStorage
  if (config.token === 'local') {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      return { data: JSON.parse(localData), sha: 'local-sha' };
    } else {
      // Return defaults if no local data exists
      return {
        data: {
          transactions: [],
          categories: DEFAULT_CATEGORIES,
          accounts: DEFAULT_ACCOUNTS,
          settings: { currency: 'CNY', darkMode: false, language: 'zh' }
        },
        sha: 'local-sha'
      };
    }
  }

  // GitHub Mode
  try {
    const res = await fetch(
      `${BASE_URL}/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        cache: 'no-store',
      }
    );

    if (res.status === 404) {
      return null; // File doesn't exist yet
    }

    if (!res.ok) throw new Error('Failed to fetch data');

    const json = await res.json();
    const content = decodeURIComponent(escape(atob(json.content))); // Robust Base64 decode
    return { data: JSON.parse(content), sha: json.sha };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const saveLedgerData = async (
  config: GitHubConfig,
  data: AppData,
  sha?: string
): Promise<{ sha: string }> => {
  // Local Mode: Save to LocalStorage
  if (config.token === 'local') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return { sha: `local-sha-${Date.now()}` };
  }

  // GitHub Mode
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  const body: any = {
    message: `Update ledger data - ${new Date().toISOString()}`,
    content: content,
    branch: BRANCH,
  };

  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(
    `${BASE_URL}/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) throw new Error('Failed to save data');
  const responseJson = await res.json();
  return { sha: responseJson.content.sha };
};

// Utilities for Local Data Management
export const exportLocalData = () => {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!localData) return;
  
  const blob = new Blob([localData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zenledger_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importLocalData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        // Basic validation
        const parsed = JSON.parse(json);
        if (parsed.transactions && parsed.categories) {
          localStorage.setItem(LOCAL_STORAGE_KEY, json);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};
