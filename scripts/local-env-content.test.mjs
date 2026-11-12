import { describe, expect, it } from 'vitest';
import { renderLocalEnv } from './local-env-content.mjs';

const status = {
  API_URL: 'http://127.0.0.1:55421',
  PUBLISHABLE_KEY: 'sb_publishable_test-only',
  SERVICE_ROLE_KEY: 'private-service-role',
  SECRET_KEY: 'sb_secret_private',
  JWT_SECRET: 'private-jwt-secret',
};

describe('local environment generation', () => {
  it('copies only the browser-safe allowlist from CLI status', () => {
    expect(renderLocalEnv(status)).toBe(
      'VITE_SUPABASE_URL=http://127.0.0.1:55421\nVITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test-only\n',
    );
  });

  it('preserves unrelated settings while replacing duplicate and exported entries', () => {
    const existing =
      '# My settings\nVITE_OTHER=value\nVITE_SUPABASE_URL=old\nexport VITE_SUPABASE_URL=duplicate\n VITE_SUPABASE_PUBLISHABLE_KEY =old\n';
    const output = renderLocalEnv(status, existing);
    expect(output).toContain('# My settings\nVITE_OTHER=value');
    expect(output.match(/VITE_SUPABASE_URL=/g)).toHaveLength(1);
    expect(output).not.toContain('old');
    expect(renderLocalEnv(status, output)).toBe(output);
  });

  it('refuses credentials or an endpoint from the wrong stack', () => {
    expect(() =>
      renderLocalEnv({ ...status, API_URL: 'http://127.0.0.1:54321' }),
    ).toThrow();
    expect(() =>
      renderLocalEnv({ ...status, PUBLISHABLE_KEY: status.SECRET_KEY }),
    ).toThrow();
  });
});
