import { writeFile, rename } from 'node:fs/promises';
import { format } from 'prettier';
import { rejectArguments, runSupabase } from './supabase-cli.mjs';

rejectArguments();
const output = runSupabase([
  'gen',
  'types',
  'typescript',
  '--schema',
  'public',
]);
if (!output.includes('export type Database')) {
  throw new Error(
    'No database types returned; the existing file has been preserved.',
  );
}
const target = new URL('../src/lib/database.types.ts', import.meta.url);
const temporary = new URL('../src/lib/database.types.ts.tmp', import.meta.url);
await writeFile(
  temporary,
  await format(output, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
  }),
);
await rename(temporary, target);
console.log('Updated src/lib/database.types.ts from the local public schema.');
