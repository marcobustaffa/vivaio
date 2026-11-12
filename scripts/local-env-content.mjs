import { readSupabaseConfig } from '../src/lib/supabase-config.ts';

export function renderLocalEnv(status, existing = '') {
  const { url, publishableKey } = readSupabaseConfig({
    VITE_SUPABASE_URL: status.API_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY,
  });
  const preserved = existing
    .split(/\r?\n/)
    .filter(
      (line) =>
        !/^\s*(?:export\s+)?VITE_SUPABASE_(?:URL|PUBLISHABLE_KEY)\s*=/.test(
          line,
        ),
    )
    .join('\n')
    .trimEnd();

  return `${preserved ? `${preserved}\n\n` : ''}VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_PUBLISHABLE_KEY=${publishableKey}\n`;
}
