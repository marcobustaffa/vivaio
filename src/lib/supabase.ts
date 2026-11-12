import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { readSupabaseConfig } from './supabase-config';

const { url, publishableKey } = readSupabaseConfig(import.meta.env);

export const supabase = createClient<Database>(url, publishableKey);
