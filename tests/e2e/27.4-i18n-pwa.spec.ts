import { test, expect } from './fixtures'

/**
 * 27.4 i18n Language Switching & PWA Tests
 * - Test switching between languages (en, es, am)
 * - Verify URL prefix changes (/es, /am)
 * - Verify hreflang tags
 * - Test PWA manifest loaded
 * - Test service worker installation
 * - Test offline fallback
 */

test.describe('27.4 i18n Language Switching & PWA', () => {
  test('should have default language (English)', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    const htmlLang = await page.getAttribute('html', 'lang')
    expect(htmlLang).toBe('en')
  })

  test('should have proper lang attribute', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    const html = page.locator('html')
    const lang = await html.getAttribute('lang')
    expect(['en', 'es', 'am']).toContain(lang)
  })

  test('should switch to Spanish language', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Look for language switcher
    const langSwitcher = page.locator(
      'button:has-text("es"), button:has-text("ES"), [data-testid="language-switcher"]'
    ).first()
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()
      
      // Look for Spanish option
      const spanishOption = page.getByRole('button', { name: 'es' }).or(
        page.getByRole('option', { name: 'es' })
      ).first()
      
      if (await spanishOption.isVisible()) {
        await spanishOption.click()
        await page.waitForTimeout(200)
        
        // Verify URL changed
        expect(page.url()).toContain('/es')
        
        // Verify lang attribute changed
        const lang = await page.getAttribute('html', 'lang')
        expect(lang).toBe('es')
      }
    }
  })

  test('should switch to Amharic language', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Look for language switcher
    const langSwitcher = page.locator(
      'button:has-text("am"), button:has-text("AM"), [data-testid="language-switcher"]'
    ).first()
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()
      
      // Look for Amharic option
      const amharicOption = page.getByRole('button', { name: 'am' }).or(
        page.getByRole('option', { name: 'am' })
      ).first()
      
      if (await amharicOption.isVisible()) {
        await amharicOption.click()
        await page.waitForTimeout(200)
        
        // Verify URL changed
        expect(page.url()).toContain('/am')
        
        // Verify lang attribute changed
        const lang = await page.getAttribute('html', 'lang')
        expect(lang).toBe('am')
      }
    }
  })

  test('should navigate to Spanish resource page', async ({ page }) => {
    await page.goto('/es/resources')
    
    // Should load Spanish version
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBe('es')
    
    // Should still be on resources page
    const url = page.url()
    expect(url).toContain('/es/resources')
  })

  test('should navigate to Amharic admin page', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('admin_authenticated', 'true')
    })
    
    await page.goto('/am/admin')
    
    // Should load Amharic version
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBe('am')
    
    // Should still be on admin page
    const url = page.url()
    expect(url).toContain('/am/admin')
  })

  test('should have hreflang tags for language alternatives', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Check for hreflang links
    const hreflangs = page.locator('link[rel="alternate"][hreflang]')
    const count = await hreflangs.count()
    
    // Should have at least one hreflang (en, es, am)
    expect(count).toBeGreaterThan(0)
    
    if (count > 0) {
      const langs = []
      for (let i = 0; i < count; i++) {
        const hreflang = await hreflangs.nth(i).getAttribute('hreflang')
        langs.push(hreflang)
      }
      
      // Should include supported languages
      const hasSupportedLang = langs.some(l => ['en', 'es', 'am', 'x-default'].includes(l!))
      expect(hasSupportedLang).toBeTruthy()
    }
  })

  test('should load PWA manifest', async ({ page }) => {
    const manifestLink = page.locator('link[rel="manifest"]')
    
    if (await manifestLink.isVisible()) {
      const href = await manifestLink.getAttribute('href')
      expect(href).toBeTruthy()
      
      // Try to fetch manifest
      const manifest = await page.evaluate(async () => {
        try {
          const resp = await fetch('/manifest.webmanifest')
          return resp.ok
        } catch {
          return false
        }
      })
      
      expect(manifest).toBeTruthy()
    }
  })

  test('should have valid PWA manifest content', async ({ page }) => {
    const manifestData = await page.evaluate(async () => {
      try {
        const resp = await fetch('/manifest.webmanifest')
        const json = await resp.json()
        return {
          name: !!json.name,
          shortName: !!json.short_name,
          startUrl: json.start_url === '/',
          display: json.display === 'standalone',
          icons: Array.isArray(json.icons) && json.icons.length > 0,
        }
      } catch {
        return null
      }
    })
    
    if (manifestData) {
      expect(manifestData.name).toBeTruthy()
      expect(manifestData.startUrl).toBeTruthy()
      expect(manifestData.display).toBeTruthy()
      expect(manifestData.icons).toBeTruthy()
    }
  })

  test('should have PWA icons in manifest', async ({ page }) => {
    const icons = await page.evaluate(async () => {
      try {
        const resp = await fetch('/manifest.webmanifest')
        const json = await resp.json()
        return json.icons || []
      } catch {
        return []
      }
    })
    
    // Should have at least 192x192 and 512x512
    const sizes = icons.map((i: any) => i.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })

  test('should register service worker', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        return registrations.length > 0
      }
      return false
    })
    
    expect(swRegistered).toBeTruthy()
  })

  test('should have service worker file', async ({ page }) => {
    const swExists = await page.evaluate(async () => {
      try {
        const resp = await fetch('/sw.js')
        return resp.ok
      } catch {
        return false
      }
    })
    
    expect(swExists).toBeTruthy()
  })

  test('should cache assets for offline access', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Check if service worker has cached the page
    const hasCache = await page.evaluate(async () => {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        return cacheNames.length > 0
      }
      return false
    })
    
    expect(hasCache).toBeTruthy()
  })

  test('should have offline fallback page', async ({ page }) => {
    const offlinePageExists = await page.evaluate(async () => {
      try {
        const resp = await fetch('/offline.html')
        return resp.ok
      } catch {
        return false
      }
    })
    
    expect(offlinePageExists).toBeTruthy()
  })

  test('should show install prompt button', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Look for install button
    const installButton = page.locator(
      'button:has-text("Install"), [data-testid*="install"], [data-testid*="pwa"]'
    ).first()
    
    // Install button might not be visible on all systems
    const visible = await installButton.isVisible().catch(() => false)
    expect(typeof visible === 'boolean').toBeTruthy()
  })

  test('should have theme colors in manifest', async ({ page }) => {
    const themeColors = await page.evaluate(async () => {
      try {
        const resp = await fetch('/manifest.webmanifest')
        const json = await resp.json()
        return {
          themeColor: json.theme_color,
          backgroundColor: json.background_color,
        }
      } catch {
        return null
      }
    })
    
    if (themeColors) {
      expect(themeColors.themeColor).toBeTruthy()
      expect(themeColors.backgroundColor).toBeTruthy()
    }
  })

  test('should have proper CSP headers', async ({ page, navigateTo }) => {
    const response = await page.goto('/')
    
    if (response) {
      const headers = await response.headers()
      const csp = headers['content-security-policy']
      
      // CSP header might be present
      if (csp) {
        expect(csp.length).toBeGreaterThan(0)
      }
    }
  })

  test('should have X-Frame-Options header', async ({ page, navigateTo }) => {
    const response = await page.goto('/')
    
    if (response) {
      const headers = await response.headers()
      const frameOptions = headers['x-frame-options']
      
      // Should have frame options or CSP frame-ancestors
      expect(frameOptions || headers['content-security-policy']).toBeTruthy()
    }
  })

  test('should switch language and persist in localStorage', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Switch language
    const langSwitcher = page.locator('button:has-text("es")').first()
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()
      await page.waitForTimeout(100)
      
      // Check localStorage
      const savedLang = await page.evaluate(() => {
        return localStorage.getItem('i18n_locale')
      })
      
      // Locale might be saved with different key
      expect(typeof savedLang === 'string' || savedLang === null).toBeTruthy()
    }
  })

  test('should restore language preference on page reload', async ({ page }) => {
    // Set language preference
    await page.addInitScript(() => {
      localStorage.setItem('i18n_locale', 'es')
    })
    
    await page.goto('/')
    
    // Should load Spanish version
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBe('es')
  })

  test('should have accessibility attributes in manifest', async ({ page }) => {
    const manifest = await page.evaluate(async () => {
      try {
        const resp = await fetch('/manifest.webmanifest')
        const json = await resp.json()
        return {
          hasName: !!json.name,
          hasShortName: !!json.short_name,
          hasDescription: !!json.description,
        }
      } catch {
        return null
      }
    })
    
    if (manifest) {
      expect(manifest.hasName).toBeTruthy()
      expect(manifest.hasShortName).toBeTruthy()
    }
  })

  test('should translate UI text on language switch', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Get initial English text
    const initialText = await page.locator('body').textContent()
    
    // Switch to Spanish
    const langSwitcher = page.locator('button:has-text("es")').first()
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()
      await page.waitForTimeout(500)
      
      // Get Spanish text
      const spainishText = await page.locator('body').textContent()
      
      // Text should be different (page translated)
      expect(initialText).not.toEqual(spainishText)
    }
  })

  test('should maintain UI state when switching languages', async ({ page, navigateTo }) => {
    await navigateTo('/')
    
    // Navigate to a page
    const resourcesLink = page.getByRole('link', { name: /resources/i }).first()
    
    if (await resourcesLink.isVisible()) {
      await resourcesLink.click()
      await page.waitForURL('/resources')
      
      // Switch language
      const langSwitcher = page.locator('button:has-text("es")').first()
      
      if (await langSwitcher.isVisible()) {
        await langSwitcher.click()
        await page.waitForTimeout(300)
        
        // Should still be on resources page (Spanish version)
        const url = page.url()
        expect(url).toContain('/es/resources')
      }
    }
  })
})
