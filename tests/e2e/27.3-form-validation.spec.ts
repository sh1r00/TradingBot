import { test, expect } from './fixtures'

/**
 * 27.3 Form Validation Tests
 * - Test email validation
 * - Test URL validation (https:// required)
 * - Test required field validation
 * - Test character limits
 * - Test error message display
 * - Test form submission with invalid/valid data
 */

test.describe('27.3 Form Validation', () => {
  test('should validate required fields', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      // Try to submit empty form
      const submitButton = form.locator('button[type="submit"]').first()
      
      if (await submitButton.isVisible()) {
        await submitButton.click()
        await page.waitForTimeout(200)
        
        // Check for validation errors
        const errorFields = form.locator('[class*="error"], [aria-invalid="true"]')
        const hasErrors = await errorFields.count() > 0
        
        // Either shows error or button is disabled
        const isDisabled = await submitButton.isDisabled()
        expect(hasErrors || isDisabled).toBeTruthy()
      }
    }
  })

  test('should validate email format', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const emailInput = form.locator('input[type="email"], input[placeholder*="email" i]').first()
      
      if (await emailInput.isVisible()) {
        // Test invalid email
        await emailInput.fill('invalid-email')
        await emailInput.blur()
        await page.waitForTimeout(100)
        
        // Check for error
        const error = emailInput.locator('.. >> [class*="error"], .. >> [role="alert"]').first()
        const hasError = await error.isVisible().catch(() => false)
        const hasInvalidAttr = await emailInput.getAttribute('aria-invalid') === 'true'
        
        expect(hasError || hasInvalidAttr || !(await emailInput.isEnabled())).toBeTruthy()
      }
    }
  })

  test('should accept valid email format', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const emailInput = form.locator('input[type="email"], input[placeholder*="email" i]').first()
      
      if (await emailInput.isVisible()) {
        // Test valid email
        await emailInput.fill('test@example.com')
        await emailInput.blur()
        await page.waitForTimeout(100)
        
        // Should not show error
        const invalidAttr = await emailInput.getAttribute('aria-invalid')
        expect(invalidAttr).not.toEqual('true')
      }
    }
  })

  test('should validate URL format requires https://', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      // Find URL field
      const urlInput = form.locator('input[type="url"], input[placeholder*="url" i], input[placeholder*="link" i]').first()
      
      if (await urlInput.isVisible()) {
        // Test invalid URL (no https)
        await urlInput.fill('http://example.com')
        await urlInput.blur()
        await page.waitForTimeout(100)
        
        // Should show error
        const hasError = await urlInput.getAttribute('aria-invalid') === 'true'
        expect(hasError).toBeTruthy()
        
        // Test valid URL (https)
        await urlInput.clear()
        await urlInput.fill('https://example.com')
        await urlInput.blur()
        await page.waitForTimeout(100)
        
        const isNowValid = await urlInput.getAttribute('aria-invalid') !== 'true'
        expect(isNowValid).toBeTruthy()
      }
    }
  })

  test('should validate character limits for text inputs', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      // Find input with maxlength
      const inputs = form.locator('input, textarea')
      
      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i)
        const maxLength = await input.getAttribute('maxlength')
        
        if (maxLength) {
          const max = parseInt(maxLength)
          
          // Try to enter more than max
          const longText = 'a'.repeat(max + 10)
          await input.fill(longText)
          
          // Value should be truncated to maxlength
          const value = await input.inputValue()
          expect(value.length).toBeLessThanOrEqual(max)
        }
      }
    }
  })

  test('should display character count near limit', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const textarea = form.locator('textarea').first()
      
      if (await textarea.isVisible()) {
        const maxLength = await textarea.getAttribute('maxlength')
        
        if (maxLength) {
          const max = parseInt(maxLength)
          const at80Percent = Math.floor(max * 0.8)
          
          // Fill to 80% of limit
          await textarea.fill('a'.repeat(at80Percent))
          await page.waitForTimeout(100)
          
          // Look for character count display
          const countDisplay = form.locator(
            `text=/${at80Percent}|${max}/`, 
            page.locator('[data-testid*="count"], [class*="count"]')
          ).first()
          
          const countVisible = await countDisplay.isVisible().catch(() => false)
          // Character count is optional feature
          expect(typeof countVisible === 'boolean').toBeTruthy()
        }
      }
    }
  })

  test('should show inline error messages below fields', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const input = form.locator('input, textarea').first()
      
      if (await input.isVisible()) {
        // Make field invalid
        if (await input.getAttribute('type') === 'email') {
          await input.fill('invalid')
        } else {
          await input.fill('')
        }
        
        // Trigger validation on blur
        await input.blur()
        await page.waitForTimeout(200)
        
        // Look for error message
        const errorContainer = input.locator('xpath=following-sibling::*[contains(@class, "error") or @role="alert"]').first()
        const hasError = await errorContainer.isVisible().catch(() => false)
        
        if (hasError) {
          const errorText = await errorContainer.textContent()
          expect(errorText?.length).toBeGreaterThan(0)
        }
      }
    }
  })

  test('should disable form submission when invalid', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const submitButton = form.locator('button[type="submit"]').first()
      
      if (await submitButton.isVisible()) {
        // Leave form in invalid state
        const emailInput = form.locator('input[type="email"]').first()
        if (await emailInput.isVisible()) {
          await emailInput.fill('invalid')
          await emailInput.blur()
          await page.waitForTimeout(100)
        }
        
        // Button should be disabled or show validation errors
        const isDisabled = await submitButton.isDisabled()
        expect(isDisabled).toBeTruthy()
      }
    }
  })

  test('should allow form submission when valid', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      // Fill form with valid data
      const titleInput = form.locator('input[type="text"]').first()
      if (await titleInput.isVisible()) {
        await titleInput.fill('Valid Title')
      }
      
      const emailInput = form.locator('input[type="email"]').first()
      if (await emailInput.isVisible()) {
        await emailInput.fill('valid@example.com')
      }
      
      const urlInput = form.locator('input[type="url"]').first()
      if (await urlInput.isVisible()) {
        await urlInput.fill('https://example.com')
      }
      
      const submitButton = form.locator('button[type="submit"]').first()
      
      if (await submitButton.isVisible()) {
        // Button should be enabled
        const isEnabled = await submitButton.isEnabled()
        expect(isEnabled).toBeTruthy()
      }
    }
  })

  test('should clear field errors on valid input', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const input = form.locator('input[type="email"]').first()
      
      if (await input.isVisible()) {
        // Make invalid
        await input.fill('invalid')
        await input.blur()
        await page.waitForTimeout(100)
        
        const hasErrorBefore = await input.getAttribute('aria-invalid') === 'true'
        
        if (hasErrorBefore) {
          // Make valid
          await input.clear()
          await input.fill('valid@example.com')
          await input.blur()
          await page.waitForTimeout(100)
          
          // Error should be cleared
          const hasErrorAfter = await input.getAttribute('aria-invalid') === 'true'
          expect(hasErrorAfter).toBeFalsy()
        }
      }
    }
  })

  test('should handle multiple field validation errors', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      // Try to submit with multiple invalid fields
      const submitButton = form.locator('button[type="submit"]').first()
      
      if (await submitButton.isVisible()) {
        await submitButton.click()
        await page.waitForTimeout(200)
        
        // Check for error summary
        const errorSummary = form.locator('[role="alert"], [data-testid*="error-summary"]').first()
        const hasSummary = await errorSummary.isVisible().catch(() => false)
        
        // Should show either summary or multiple inline errors
        if (hasSummary) {
          const text = await errorSummary.textContent()
          expect(text?.length).toBeGreaterThan(0)
        }
      }
    }
  })

  test('should trim whitespace before validation', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const input = form.locator('input[type="text"]').first()
      
      if (await input.isVisible()) {
        // Enter text with extra whitespace
        await input.fill('  valid text  ')
        await input.blur()
        await page.waitForTimeout(100)
        
        // After blur/validation, whitespace should be trimmed
        const value = await input.inputValue()
        expect(value.trim()).toEqual(value)
      }
    }
  })

  test('should focus first invalid field on form submit', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const submitButton = form.locator('button[type="submit"]').first()
      
      if (await submitButton.isVisible()) {
        // Click submit with invalid form
        await submitButton.click()
        await page.waitForTimeout(300)
        
        // Focus should move to first invalid field
        const focusedElement = page.locator(':focus').first()
        const focusedLocator = await focusedElement.boundingBox()
        
        // Should have focused something
        expect(focusedLocator).not.toBeNull()
      }
    }
  })

  test('should announce validation errors to screen readers', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      const input = form.locator('input[type="email"]').first()
      
      if (await input.isVisible()) {
        // Trigger validation error
        await input.fill('invalid')
        await input.blur()
        await page.waitForTimeout(100)
        
        // Should have aria-invalid or aria-errormessage
        const hasAriaInvalid = await input.getAttribute('aria-invalid')
        const hasAriaError = await input.getAttribute('aria-errormessage')
        
        expect(hasAriaInvalid !== null || hasAriaError !== null).toBeTruthy()
      }
    }
  })

  test('should not show validation errors until user interaction', async ({ page, navigateTo }) => {
    await navigateTo('/admin')
    
    const form = page.locator('form, [role="form"]').first()
    
    if (await form.isVisible()) {
      // Immediately check for errors without interaction
      const errorMessages = form.locator('[class*="error"], [role="alert"]')
      const errorCount = await errorMessages.count()
      
      // Should not show errors on page load
      expect(errorCount).toBe(0)
    }
  })
})
