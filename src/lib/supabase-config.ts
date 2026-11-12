type SupabaseEnvironment = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

export function readSupabaseConfig(env: SupabaseEnvironment) {
  const url = env.VITE_SUPABASE_URL?.trim();
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error(
      'Missing Supabase configuration. Run npm run db:start and npm run db:env, then restart Vite.',
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('VITE_SUPABASE_URL must be a valid local API URL.');
  }

  if (
    parsed.protocol !== 'http:' ||
    !['127.0.0.1', 'localhost'].includes(parsed.hostname) ||
    parsed.port !== '55421' ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== '/'
  ) {
    throw new Error(
      'Vivaio uses the local Supabase API at http://127.0.0.1:55421.',
    );
  }

  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) {
    throw new Error(
      'VITE_SUPABASE_PUBLISHABLE_KEY must be a browser-safe publishable key from npm run db:env.',
    );
  }

  return { url: parsed.origin, publishableKey };
}
