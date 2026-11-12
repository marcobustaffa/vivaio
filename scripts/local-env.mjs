import { chmod, readFile, writeFile } from 'node:fs/promises';
import { renderLocalEnv } from './local-env-content.mjs';
import { rejectArguments, runSupabase } from './supabase-cli.mjs';

rejectArguments();
const status = JSON.parse(runSupabase(['status', '-o', 'json']));
const target = new URL('../.env.local', import.meta.url);
const existing = await readFile(target, 'utf8').catch((error) => {
  if (error.code === 'ENOENT') return '';
  throw error;
});
await writeFile(target, renderLocalEnv(status, existing), { mode: 0o600 });
await chmod(target, 0o600);
console.log(
  'Updated .env.local with the local API URL and publishable key. Restart Vite to load changes.',
);
