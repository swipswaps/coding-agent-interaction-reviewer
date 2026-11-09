import { test, expect } from '@playwright/test'
test.beforeEach(async ({ page }) => { await page.goto('./'); await page.evaluate(() => document.fonts.ready) })

test('the catch panel names an interaction and a note', async ({ page }) => {
  await expect(page.getByTestId('catch')).toBeVisible()
  await expect(page.getByTestId('catch-note')).not.toBeEmpty()
})

test('the header reports the rubric is sound', async ({ page }) => {
  await expect(page.locator('.stats')).toContainText('sound')
  await expect(page.locator('.stats')).toContainText('yes')
})

test('dashboard screenshot is stable', async ({ page }) => {
  await expect(page.locator('main')).toHaveScreenshot('dashboard.png')
})
