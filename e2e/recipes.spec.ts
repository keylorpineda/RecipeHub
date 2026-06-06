import { test, expect, type Page, APIRequestContext } from '@playwright/test';

const timestamp = Date.now();
const AUTHOR_EMAIL = `author_${timestamp}@example.com`;
const OTHER_EMAIL = `other_${timestamp}@example.com`;
const PASSWORD = 'TestPass123!';
const API_URL = 'https://api.recipehub.me';

/** Skip the test if the API is not reachable (runs fine in CI after deploy). */
async function requireApi(request: APIRequestContext) {
  try {
    const res = await request.get(`${API_URL}/api/health`, { timeout: 8000 });
    if (!res.ok()) test.skip(true, `API not healthy (${res.status()}) — skipping`);
  } catch {
    test.skip(true, 'API not reachable locally — test will run in CI after deploy');
  }
}

/** Helper: register + log in, returns the page ready to use. */
async function registerAndLogin(page: Page, nombre: string, email: string) {
  await page.goto('/register');
  await page.locator('input[name="nombre"], input[placeholder*="nombre" i]').fill(nombre);
  await page.locator('input[type="email"], input[name="email"]').fill(email);
  await page.locator('input[type="password"], input[name="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.pathname.startsWith('/register'), { timeout: 10000 });
}

test.describe('Recipes — create flow', () => {
  test('visiting /nueva unauthenticated redirects to /login', async ({ page }) => {
    await page.goto('/nueva');
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('authenticated user can access /nueva', async ({ page, request }) => {
    await requireApi(request);
    await registerAndLogin(page, 'Autor Test', AUTHOR_EMAIL);
    await page.goto('/nueva');
    await expect(page.locator('form')).toBeVisible({ timeout: 5000 });
  });

  test('create-recipe form has all required fields', async ({ page, request }) => {
    await requireApi(request);
    await registerAndLogin(page, `Autor_${timestamp}`, `check_${timestamp}@example.com`);
    await page.goto('/nueva');
    // Core fields (categoria y dificultad ahora son CustomSelect — buscar por id del contenedor)
    await expect(page.locator('input[id*="titulo" i], input[placeholder*="título" i]')).toBeVisible();
    await expect(page.locator('textarea[id*="descripcion" i], textarea[placeholder*="descripción" i]')).toBeVisible();
    await expect(page.locator('#field-categoria')).toBeVisible();
    await expect(page.locator('input[id*="tiempo" i]')).toBeVisible();
    await expect(page.locator('input[id*="porciones" i]')).toBeVisible();
    await expect(page.locator('#field-dificultad')).toBeVisible();
  });

  test('can add an extra ingredient row dynamically', async ({ page, request }) => {
    await requireApi(request);
    await registerAndLogin(page, `Author_${timestamp}`, `addingr_${timestamp}@example.com`);
    await page.goto('/nueva');
    const addIngBtn = page.getByRole('button', { name: /agregar ingrediente/i });
    await expect(addIngBtn).toBeVisible();
    const before = await page.locator('.ingredient-row').count();
    await addIngBtn.click();
    const after = await page.locator('.ingredient-row').count();
    expect(after).toBeGreaterThan(before);
  });

  test('can add an extra step row dynamically', async ({ page, request }) => {
    await requireApi(request);
    await registerAndLogin(page, `Author2_${timestamp}`, `addstep_${timestamp}@example.com`);
    await page.goto('/nueva');
    const addStepBtn = page.getByRole('button', { name: /agregar paso/i });
    await expect(addStepBtn).toBeVisible();
    const before = await page.locator('.dynamic-item').count();
    await addStepBtn.click();
    const after = await page.locator('.dynamic-item').count();
    expect(after).toBeGreaterThan(before);
  });

  test('creating a recipe successfully redirects to the detail page', async ({ page, request }) => {
    await requireApi(request);
    const email = `creator_${timestamp}@example.com`;
    await registerAndLogin(page, `Creator_${timestamp}`, email);
    await page.goto('/nueva');

    // Fill required fields
    await page.locator('input[id*="titulo" i]').fill('Pasta Carbonara E2E');
    await page.locator('textarea[id*="descripcion" i]').fill('Receta clásica italiana con huevo, guanciale y Pecorino Romano. Sin crema.');
    // Categoría: CustomSelect — abrir y elegir la primera opción real
    await page.locator('#field-categoria .custom-select-trigger').click();
    await page.locator('#field-categoria .custom-select-option:not(.custom-select-option--selected)').first().click();
    await page.locator('input[id*="tiempo" i]').fill('25');
    await page.locator('input[id*="porciones" i]').fill('4');
    // Dificultad: CustomSelect — abrir y elegir la primera opción real
    await page.locator('#field-dificultad .custom-select-trigger').click();
    await page.locator('#field-dificultad .custom-select-option:not(.custom-select-option--selected)').first().click();

    // Add image URL so the recipe has a photo
    await page.locator('input[type="url"]').fill('https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&q=80');

    // Fill the first ingredient row
    const ingRows = page.locator('.ingredient-row');
    await ingRows.first().locator('input').nth(0).fill('Espagueti');
    await ingRows.first().locator('input').nth(1).fill('400');
    await ingRows.first().locator('input').nth(2).fill('g');

    // Fill the first step
    await page.locator('.dynamic-item textarea').first().fill('Cocer la pasta al dente y reservar el agua de cocción.');

    await page.locator('button[type="submit"]').click();

    // Should navigate to /recetas/:id
    await page.waitForURL(/\/recetas\/[a-f0-9]+/, { timeout: 15000 });
    expect(page.url()).toMatch(/\/recetas\//);

    // Verify the recipe detail shows the image
    const recipeImage = page.locator('img').first();
    await expect(recipeImage).toBeVisible({ timeout: 5000 });

    // ── Cleanup: delete the test recipe so it doesn't pollute production ──
    const recipeId = page.url().split('/recetas/')[1];
    if (recipeId) {
      await request.delete(`${API_URL}/api/recetas/${recipeId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  });
});

test.describe('Recipe detail page', () => {
  test('detail page shows ingredients and steps sections', async ({ page }) => {
    // Navigate to home and click the first available recipe card
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('a.recipe-card').first();
    const cardCount = await firstCard.count();
    if (cardCount === 0) {
      test.skip(true, 'No hay recetas en producción para testear el detalle');
    }

    await firstCard.click();
    await page.waitForURL(/\/recetas\//, { timeout: 5000 });

    // Ingredients section and preparation steps section must be present
    // (detail-card titles are "Ingredientes" and "Preparación")
    await expect(page.getByText(/ingredientes/i).first()).toBeVisible();
    await expect(page.getByText(/preparación/i).first()).toBeVisible();
  });

  test('edit/delete buttons are not visible to unauthenticated users', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('a.recipe-card').first();
    if ((await firstCard.count()) === 0) {
      test.skip(true, 'No hay recetas disponibles');
    }

    await firstCard.click();
    await page.waitForURL(/\/recetas\//, { timeout: 5000 });

    // Neither edit nor delete buttons should be visible for anon users
    await expect(page.getByRole('link', { name: /editar/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /eliminar/i })).not.toBeVisible();
  });
});
