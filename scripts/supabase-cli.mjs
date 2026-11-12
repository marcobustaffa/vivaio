import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const binary = fileURLToPath(
  new URL('../node_modules/.bin/supabase', import.meta.url),
);

export function runSupabase(args) {
  return execFileSync(binary, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
    maxBuffer: 10 * 1024 * 1024,
  });
}

export function rejectArguments() {
  if (process.argv.length > 2) {
    throw new Error(
      'This script only targets Vivaio locally and accepts no arguments.',
    );
  }
}
