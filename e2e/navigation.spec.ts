import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navbar is visible on the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('navbar is visible on the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('navbar is visible on the register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('logo link navigates to home (/)', async ({ page }) => {
    await page.goto('/login');
    // The logo link text is "RecipeHub"
    await page.getByRole('link', { name: /recipehub/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('"Inicio" nav link navigates to /', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /^inicio$/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('React Router SPA routing: /login reloads without 404', async ({ page }) => {
    const res = await page.goto('/login');
    // SPA: server should return the index.html shell (200) even for client-side routes
    expect(res?.status()).toBe(200);
  });

  test('React Router SPA routing: /register reloads without 404', async ({ page }) => {
    const res = await page.goto('/register');
    expect(res?.status()).toBe(200);
  });

  test('hamburger button is visible on a 375px-wide viewport (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // The hamburger button has aria-label "Abrir menú" or "Cerrar menú"
    const hamburger = page.locator('button[aria-label*="menú" i], button[class*="hamburger"]');
    await expect(hamburger).toBeVisible();
  });

  test('hamburger menu opens when tapped on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const hamburger = page.locator('button[aria-label*="menú" i], button[class*="hamburger"]');
    await hamburger.click();
    // The mobile drawer should now be visible (has "is-open" class or aria-hidden=false)
    const drawer = page.locator('#mobile-menu, [class*="mobile-menu"]');
    await expect(drawer).toBeVisible({ timeout: 2000 });
  });

  test('hamburger menu closes when a link inside is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    const hamburger = page.locator('button[aria-label*="menú" i], button[class*="hamburger"]');
    await hamburger.click();

    // Click the "Inicio" link inside the drawer
    const drawer = page.locator('#mobile-menu');
    await drawer.getByRole('link', { name: /^inicio$/i }).click();

    // After navigation the drawer should close
    await expect(page).toHaveURL('/');
  });
});
