/**
 * Atomic Tier Enforcement Linter
 *
 * Checks that components follow strict atomic design tier boundaries:
 * - Atoms (A-prefix): no reactive state, no stores, no lifecycle hooks, no watchers
 * - Molecules (M-prefix): imports only from atoms/, no store access, no API calls, no router
 * - Organisms (O-prefix): must have O prefix
 *
 * Exit non-zero on any violation.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const componentsDir = resolve(rootDir, 'app', 'components')

const violations = []

// Forbidden patterns for atoms
const atomForbidden = [
  { pattern: /\bref\s*\(/, label: 'ref(' },
  { pattern: /\breactive\s*\(/, label: 'reactive(' },
  { pattern: /\bwatch\s*\(/, label: 'watch(' },
  { pattern: /\bwatchEffect\s*\(/, label: 'watchEffect(' },
  { pattern: /\bonMounted\s*\(/, label: 'onMounted(' },
  { pattern: /\bonUnmounted\s*\(/, label: 'onUnmounted(' },
  { pattern: /\bonBeforeMount\s*\(/, label: 'onBeforeMount(' },
  { pattern: /\busePinia\b/, label: 'usePinia' },
  { pattern: /\buseStore\b/, label: 'useStore' },
  { pattern: /\buseState\b/, label: 'useState' },
]

// Forbidden patterns for molecules
const moleculeForbidden = [
  { pattern: /\buseFetch\s*\(/, label: 'useFetch(' },
  { pattern: /\buseAsyncData\s*\(/, label: 'useAsyncData(' },
  { pattern: /\$fetch\s*\(/, label: '$fetch(' },
  { pattern: /\buseRoute\s*\(/, label: 'useRoute(' },
  { pattern: /\buseRouter\s*\(/, label: 'useRouter(' },
  { pattern: /from\s+['"].*stores\//, label: 'store import' },
  { pattern: /\busePinia\b/, label: 'usePinia' },
  { pattern: /\buseStore\b/, label: 'useStore' },
]

function getVueFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.vue'))
    .map((f) => ({ name: f, path: resolve(dir, f) }))
}

function checkAtoms() {
  const atomsDir = resolve(componentsDir, 'atoms')
  const files = getVueFiles(atomsDir)

  for (const file of files) {
    // Check prefix
    if (!file.name.startsWith('A')) {
      violations.push(`[atoms] ${file.name}: filename must start with 'A'`)
    }

    const content = readFileSync(file.path, 'utf-8')

    for (const { pattern, label } of atomForbidden) {
      if (pattern.test(content)) {
        violations.push(`[atoms] ${file.name}: contains forbidden '${label}'`)
      }
    }
  }
}

function checkMolecules() {
  const moleculesDir = resolve(componentsDir, 'molecules')
  const files = getVueFiles(moleculesDir)

  for (const file of files) {
    // Check prefix
    if (!file.name.startsWith('M')) {
      violations.push(`[molecules] ${file.name}: filename must start with 'M'`)
    }

    const content = readFileSync(file.path, 'utf-8')

    // Check forbidden patterns
    for (const { pattern, label } of moleculeForbidden) {
      if (pattern.test(content)) {
        violations.push(`[molecules] ${file.name}: contains forbidden '${label}'`)
      }
    }

    // Check imports — molecules should only import from atoms/ (not molecules/ or organisms/)
    const importLines = content.match(/import\s+.*from\s+['"][^'"]+['"]/g) || []
    for (const importLine of importLines) {
      const fromMatch = importLine.match(/from\s+['"]([^'"]+)['"]/)
      if (!fromMatch) continue
      const importPath = fromMatch[1]

      // Skip non-relative imports (npm packages)
      if (!importPath.startsWith('.') && !importPath.startsWith('~') && !importPath.startsWith('@/')) continue

      // Check that component imports only come from atoms
      if (importPath.includes('molecules/') || importPath.includes('organisms/')) {
        violations.push(`[molecules] ${file.name}: imports from non-atom path '${importPath}'`)
      }
    }
  }
}

function checkOrganisms() {
  const organismsDir = resolve(componentsDir, 'organisms')
  const files = getVueFiles(organismsDir)

  for (const file of files) {
    // Check prefix
    if (!file.name.startsWith('O')) {
      violations.push(`[organisms] ${file.name}: filename must start with 'O'`)
    }
  }
}

// Run checks
checkAtoms()
checkMolecules()
checkOrganisms()

if (violations.length > 0) {
  console.error('❌ Atomic tier violations found:\n')
  for (const v of violations) {
    console.error(`  • ${v}`)
  }
  console.error(`\n${violations.length} violation(s) found.`)
  process.exit(1)
} else {
  console.log('✓ All components pass atomic tier boundary checks.')
}
