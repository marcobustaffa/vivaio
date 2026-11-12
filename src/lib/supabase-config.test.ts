import { describe, expect, it } from 'vitest';
import { readSupabaseConfig } from './supabase-config';

const valid = {
  VITE_SUPABASE_URL: 'http://127.0.0.1:55421',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-only',
};

describe('local Supabase configuration', () => {
  it.each([
    {},
    { VITE_SUPABASE_URL: valid.VITE_SUPABASE_URL },
    { VITE_SUPABASE_PUBLISHABLE_KEY: valid.VITE_SUPABASE_PUBLISHABLE_KEY },
    { ...valid, VITE_SUPABASE_PUBLISHABLE_KEY: ' ' },
  ])('explains how to supply missing configuration', (env) => {
    expect(() => readSupabaseConfig(env)).toThrow('npm run db:env');
  });

  it.each(['http://127.0.0.1:55421', 'http://localhost:55421/'])(
    'accepts the dedicated local API at %s',
    (url) => {
      expect(readSupabaseConfig({ ...valid, VITE_SUPABASE_URL: url })).toEqual({
        url: new URL(url).origin,
        publishableKey: valid.VITE_SUPABASE_PUBLISHABLE_KEY,
      });
    },
  );

  it.each([
    'invalid',
    'https://project.supabase.co',
    'http://127.0.0.1:54321',
    'https://127.0.0.1:55421',
    'http://127.0.0.1.example.com:55421',
    'http://user:password@localhost:55421',
    'http://localhost:55421/rest/v1',
    'http://localhost:55421/?key=value',
    'http://localhost:55421/#fragment',
  ])('rejects remote, incorrect, or malformed targets: %s', (url) => {
    expect(() =>
      readSupabaseConfig({ ...valid, VITE_SUPABASE_URL: url }),
    ).toThrow();
  });

  it.each([
    'sb_secret_private',
    'eyJhbGciOiJIUzI1NiJ9.private',
    'placeholder',
    'sb_publishable_',
  ])('rejects non-publishable credentials', (key) => {
    expect(() =>
      readSupabaseConfig({ ...valid, VITE_SUPABASE_PUBLISHABLE_KEY: key }),
    ).toThrow('browser-safe');
  });
});
