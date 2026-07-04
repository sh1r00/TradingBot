import { test as base, expect, type Page, type Locator } from '@playwright/test'

/**
 * Base test fixtures providing common utilities for E2E tests.
 * Extends Playwright's base test with page navigation helpers
 * and accessibility assertion utilities.
 */

interface TestFixtures {
  /** Navigate to a page and wait for it to be ready */
  navigateTo: (path: string) => Promise<void>
  /** Assert that an element has the expected accessible role */
  expectRole: (locator: Locator, role: string) => Promise<void>
  /** Assert that the page has no accessibility violations for landmarks */
  assertLandmarks: () => Promise<void>
  /** Assert that focus moves to the main content area after navigation */
  assertFocusOnMain: () => Promise<void>
  /** Assert that an aria-live region exists and contains expected text */
  assertAriaLive: (politeness: 'polite' | 'assertive', text?: string) => Promise<void>
  /** Tab through interactive elements and verify logical order */
  assertTabOrder: (selectors: string[]) => Promise<void>
}

export const test = base.extend<TestFixtures>({
  navigateTo: async ({ page }, use) => {
    const navigate = async (path: string) => {
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')
    }
    await use(navigate)
  },

  expectRole: async ({ page }, use) => {
    const checkRole = async (locator: Locator, role: string) => {
      await expect(locator).toHaveAttribute('role', role)
    }
    await use(checkRole)
  },

  assertLandmarks: async ({ page }, use) => {
    const check = async () => {
      const main = page.locator('main')
      await expect(main).toBeVisible()

      const nav = page.locator('nav')
      await expect(nav.first()).toBeVisible()

      const header = page.locator('header')
      await expect(header.first()).toBeVisible()

      const footer = page.locator('footer')
      await expect(footer.first()).toBeVisible()
    }
    await use(check)
  },

  assertFocusOnMain: async ({ page }, use) => {
    const check = async () => {
      const mainContent = page.locator('#main-content')
      await expect(mainContent).toBeFocused({ timeout: 500 })
    }
    await use(check)
  },

  assertAriaLive: async ({ page }, use) => {
    const check = async (politeness: 'polite' | 'assertive', text?: string) => {
      const liveRegion = page.locator(`[aria-live="${politeness}"]`)
      await expect(liveRegion.first()).toBeAttached()
      if (text) {
        await expect(liveRegion.first()).toContainText(text)
      }
    }
    await use(check)
  },

  assertTabOrder: async ({ page }, use) => {
    const check = async (selectors: string[]) => {
      for (const selector of selectors) {
        await page.keyboard.press('Tab')
        const focused = page.locator(selector)
        await expect(focused).toBeFocused()
      }
    }
    await use(check)
  },
})

export { expect }
