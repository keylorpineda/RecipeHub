import { test, expect } from '@playwright/test';

const API_URL = 'https://api.recipehub.me';

test.describe('API Health', () => {
  test('GET /api/health returns HTTP 200', async ({ request }) => {
    const res = await request.get(`${API_URL}/api/health`);
    expect(res.status()).toBe(200);
  });

  test('response body contains { status: "ok" }', async ({ request }) => {
    const res = await request.get(`${API_URL}/api/health`);
    const body = await res.json();
    expect(body).toMatchObject({ status: 'ok' });
  });

  test('response body contains a valid ISO timestamp', async ({ request }) => {
    const res = await request.get(`${API_URL}/api/health`);
    const body = await res.json();
    expect(typeof body.timestamp).toBe('string');
    // Must be parseable as a date and not NaN
    expect(Number.isNaN(new Date(body.timestamp).getTime())).toBe(false);
  });
});
