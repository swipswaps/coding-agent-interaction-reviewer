import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => { await page.goto('./'); await page.evaluate(() => document.fonts.ready) })
test('the catch panel names a candidate and a hidden input', async ({ page }) => {
  await expect(page.getByTestId('catch')).toBeVisible()
  await expect(page.getByTestId('catch-note')).not.toBeEmpty()
})
test('the edge-case-broken count is greater than zero', async ({ page }) => {
  expect(Number(await page.getByTestId('stat-broken').innerText())).toBeGreaterThan(0)
})
test('the header reports the review is sound', async ({ page }) => {
  await expect(page.locator('.stats')).toContainText('sound')
  await expect(page.locator('.stats')).toContainText('yes')
})
test('dashboard screenshot is stable', async ({ page }) => {
  await expect(page.locator('main')).toHaveScreenshot('dashboard.png')
})
