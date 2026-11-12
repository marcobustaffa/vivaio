import { rejectArguments, runSupabase } from './supabase-cli.mjs';

rejectArguments();
// CLI v3 targets the local stack when --remote is absent.
process.stdout.write(runSupabase(['db', 'reset']));
