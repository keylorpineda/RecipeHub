import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('loads with HTTP 200', async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBe(200);
  });

  test('page title includes RecipeHub', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/recipehub/i);
  });

  test('RecipeHub brand/logo text is visible on the page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/recipehub/i).first()).toBeVisible();
  });

  test('search or filter input is visible (category or difficulty selects)', async ({ page }) => {
    await page.goto('/');
    // Wait for React to hydrate
    await page.waitForLoadState('networkidle');
    // At least one of the filter controls is present
    const hasSelect = (await page.locator('select').count()) > 0;
    const hasInput = (await page.locator('input[type="search"], input[placeholder]').count()) > 0;
    expect(hasSelect || hasInput).toBe(true);
  });

  test('recipe grid section renders (skeleton, cards, or empty state)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // After the API response (success or error), one of these is always rendered:
    // .skeleton-card (loading), .recipe-card (has recipes), .empty-state (no recipes / API error)
    const gridContent = page.locator('.skeleton-card, .recipe-card, .empty-state');
    await expect(gridContent.first()).toBeVisible({ timeout: 10000 });
  });

  test('navbar is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav.navbar, nav[class*="navbar"], nav')).toBeVisible();
  });
});
