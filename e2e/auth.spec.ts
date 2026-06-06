import { test, expect } from '@playwright/test';

// Use a unique email per test run to avoid conflicts with existing test data
const timestamp = Date.now();
const TEST_EMAIL = `e2euser_${timestamp}@example.com`;
const TEST_PASSWORD = 'TestPass123!';
const TEST_NAME = 'E2E User';

const API_URL = 'https://api.recipehub.me';

/** Skip the test if the API is not reachable (runs fine in CI after deploy). */
async function requireApi(request: Parameters<Parameters<typeof test>[1]>[0]['request']) {
  try {
    const res = await request.get(`${API_URL}/api/health`, { timeout: 8000 });
    if (!res.ok()) test.skip(true, `API not healthy (${res.status()}) — skipping`);
  } catch {
    test.skip(true, 'API not reachable locally — test will run in CI after deploy');
  }
}

test.describe('Auth — /login page', () => {
  test('/login loads correctly', async ({ page }) => {
    const res = await page.goto('/login');
    expect(res?.status()).toBe(200);
    await expect(page.locator('form')).toBeVisible();
  });

  test('login form has email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test('login with wrong credentials shows an error message', async ({ page, request }) => {
    await requireApi(request);
    await page.goto('/login');
    await page.locator('input[type="email"], input[name="email"]').fill('noexiste@example.com');
    await page.locator('input[type="password"], input[name="password"]').fill('wrongpass');
    await page.locator('button[type="submit"]').click();
    // An error message should appear (any .alert, .error, [role="alert"], or red text)
    const error = page.locator('[class*="alert"], [class*="error"], [role="alert"]');
    await expect(error.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Auth — /register page', () => {
  test('/register loads correctly', async ({ page }) => {
    const res = await page.goto('/register');
    expect(res?.status()).toBe(200);
    await expect(page.locator('form')).toBeVisible();
  });

  test('register form has nombre, email and password fields', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('input[name="nombre"], input[placeholder*="nombre" i]')).toBeVisible();
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test('register with valid data redirects to home (/)', async ({ page, request }) => {
    await requireApi(request);
    await page.goto('/register');
    await page.locator('input[name="nombre"], input[placeholder*="nombre" i]').fill(TEST_NAME);
    await page.locator('input[type="email"], input[name="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"], input[name="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    // After successful register the app should redirect away from /register
    await page.waitForURL((url) => !url.pathname.startsWith('/register'), { timeout: 10000 });
    expect(page.url()).not.toContain('/register');
  });

  test('login with the newly registered account redirects to home (/)', async ({ page, request }) => {
    await requireApi(request);
    await page.goto('/login');
    await page.locator('input[type="email"], input[name="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"], input[name="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 10000 });
    expect(page.url()).not.toContain('/login');
  });
});

test.describe('Auth — protected routes redirect', () => {
  test('/nueva redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/nueva');
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('/perfil redirects to /login when not authenticated', async ({ page }) => {
    await page.goto('/perfil');
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });
});
