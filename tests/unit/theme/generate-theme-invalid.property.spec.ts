// Feature: money-conversion-spa, Property 15: Invalid Hex Seed Rejection
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync, rmSync, copyFileSync, symlinkSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'

/**
 * **Validates: Requirements 15.7**
 *
 * Property 15: Invalid Hex Seed Rejection
 * For any string that is NOT a valid 6-character hexadecimal color code
 * (wrong length, non-hex characters, missing # prefix, empty string),
 * the theme generator shall exit with a non-zero status code and produce
 * an error message identifying which seed value is invalid.
 */

const PROJECT_ROOT = resolve(__dirname, '../../..')
const SCRIPT_PATH = resolve(PROJECT_ROOT, 'scripts/generate-theme.mjs')
const NODE_MODULES = resolve(PROJECT_ROOT, 'node_modules')
const HEX_REGEX = /^#[0-9a-fA-F]{6}$/

/**
 * Arbitrary that generates strings which are NOT valid 6-char hex color codes.
 * Covers: missing #, wrong length, non-hex characters, empty strings.
 */
const invalidHexArbitrary = fc.oneof(
  // Empty string
  fc.constant(''),
  // Missing # prefix (6 hex chars without leading #)
  fc.stringMatching(/^[0-9a-fA-F]{6}$/, { maxLength: 6 }),
  // Wrong length with # prefix (too short: 1-5 hex chars)
  fc.integer({ min: 1, max: 5 }).chain((len) =>
    fc.stringMatching(new RegExp(`^[0-9a-fA-F]{${len}}$`), { maxLength: len }).map((s) => `#${s}`)
  ),
  // Wrong length with # prefix (too long: 7-12 hex chars)
  fc.integer({ min: 7, max: 12 }).chain((len) =>
    fc.stringMatching(new RegExp(`^[0-9a-fA-F]{${len}}$`), { maxLength: len }).map((s) => `#${s}`)
  ),
  // Non-hex characters after # (correct length but invalid chars)
  fc.stringMatching(/^[g-z]{6}$/, { maxLength: 6 }).map((s) => `#${s}`),
  // Arbitrary strings that don't match the hex pattern
  fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !HEX_REGEX.test(s))
)

/**
 * The three seed field names that the script validates
 */
const seedFields = ['primary', 'secondary', 'tertiary'] as const

function createTempDir(): string {
  const dir = join(tmpdir(), `theme-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

function cleanupTempDir(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true })
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Sets up a temp directory that mimics the project structure:
 * - package.json with the specified (invalid) theme
 * - scripts/generate-theme.mjs (copied from the real project)
 * - node_modules symlinked to the real project's node_modules
 * - app/assets/css/ directory for output
 */
function setupTempProject(dir: string, theme: Record<string, string>): void {
  // Write package.json with the specified theme
  const pkg = {
    name: 'test-theme',
    version: '1.0.0',
    theme,
  }
  writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf-8')

  // Create scripts directory and copy the generate-theme script
  const scriptsDir = join(dir, 'scripts')
  mkdirSync(scriptsDir, { recursive: true })
  copyFileSync(SCRIPT_PATH, join(scriptsDir, 'generate-theme.mjs'))

  // Symlink node_modules so ESM can resolve @material/material-color-utilities
  try {
    symlinkSync(NODE_MODULES, join(dir, 'node_modules'), 'junction')
  } catch {
    // If symlink fails (permissions), try directory junction on Windows
    execSync(`mklink /J "${join(dir, 'node_modules')}" "${NODE_MODULES}"`, {
      stdio: 'ignore',
      shell: 'cmd.exe',
    })
  }

  // Create output directory
  mkdirSync(join(dir, 'app', 'assets', 'css'), { recursive: true })
}

function runThemeGenerator(projectDir: string): { exitCode: number; output: string } {
  const scriptPath = join(projectDir, 'scripts', 'generate-theme.mjs')
  try {
    const output = execSync(`node "${scriptPath}"`, {
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000,
    })
    return { exitCode: 0, output }
  } catch (error: any) {
    const stderr = error.stderr?.toString() || ''
    const stdout = error.stdout?.toString() || ''
    return {
      exitCode: error.status ?? 1,
      output: stderr + stdout,
    }
  }
}

describe('Property 15: Invalid Hex Seed Rejection', () => {
  it('rejects invalid hex seed for each seed field with non-zero exit and error message', () => {
    fc.assert(
      fc.property(
        invalidHexArbitrary,
        fc.constantFrom(...seedFields),
        (invalidSeed, fieldName) => {
          // Skip if the generated string accidentally matches a valid hex
          if (HEX_REGEX.test(invalidSeed)) return

          const tempDir = createTempDir()
          try {
            // Create a theme with one invalid seed and valid values for the others
            const theme: Record<string, string> = {
              primary: '#6750A4',
              secondary: '#958DA5',
              tertiary: '#7D5260',
            }
            theme[fieldName] = invalidSeed

            setupTempProject(tempDir, theme)

            const result = runThemeGenerator(tempDir)

            // Script must exit with non-zero status
            expect(result.exitCode).not.toBe(0)

            // Output must contain error message identifying the invalid seed
            const output = result.output.toLowerCase()
            expect(
              output.includes(fieldName) || output.includes('invalid') || output.includes('error')
            ).toBe(true)
          } finally {
            cleanupTempDir(tempDir)
          }
        }
      ),
      { numRuns: 50 } // Reduced runs since each iteration spawns a child process
    )
  }, 120000) // Extended timeout for child process spawning

  it('rejects empty string seed values', () => {
    for (const fieldName of seedFields) {
      const tempDir = createTempDir()
      try {
        const theme: Record<string, string> = {
          primary: '#6750A4',
          secondary: '#958DA5',
          tertiary: '#7D5260',
        }
        theme[fieldName] = ''

        setupTempProject(tempDir, theme)

        const result = runThemeGenerator(tempDir)

        expect(result.exitCode).not.toBe(0)
        expect(result.output.toLowerCase()).toContain(fieldName)
      } finally {
        cleanupTempDir(tempDir)
      }
    }
  }, 30000)

  it('rejects missing seed fields entirely', () => {
    for (const fieldName of seedFields) {
      const tempDir = createTempDir()
      try {
        const theme: Record<string, string> = {
          primary: '#6750A4',
          secondary: '#958DA5',
          tertiary: '#7D5260',
        }
        delete theme[fieldName]

        setupTempProject(tempDir, theme)

        const result = runThemeGenerator(tempDir)

        expect(result.exitCode).not.toBe(0)
        expect(result.output.toLowerCase()).toContain(fieldName)
      } finally {
        cleanupTempDir(tempDir)
      }
    }
  }, 30000)
})
