#!/usr/bin/env node
/**
 * Atomic tier boundary enforcement script.
 * Validates that components in atoms/molecules/organisms adhere to
 * the architectural rules defined in the spec.
 *
 * Requirements: 14.2–14.6
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, basename } from 'path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const COMPONENTS_DIR = join(ROOT, 'app', 'components')

const ATOM_FORBIDDEN = [
  'ref(',
  'reactive(',
  'watch(',
  'watchEffect(',
  'onMounted(',
  'onUnmounted(',
  'usePinia',
  'useStore',
  'useState',
]

const MOLECULE_FORBIDDEN_IMPORTS = [
  'molecules/',
  'organisms/',
]

const MOLECULE_FORBIDDEN_CALLS = [
  'useFetch(',
  'useAsyncData(',
  '$fetch',
  'useRoute(',
  'useRouter(',
]

const violations = []

function readVueFile(filePath) {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

function getVueFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.vue'))
    .map((f) => join(dir, f))
}

function checkAtoms() {
  const atomDir = join(COMPONENTS_DIR, 'atoms')
  const files = getVueFiles(atomDir)

  for (const file of files) {
    const name = basename(file)

    // Check naming convention
    if (!name.startsWith('A')) {
      violations.push(`[Naming] atoms/${name}: atom components must start with 'A'`)
    }

    const content = readVueFile(file)

    // Check for forbidden patterns
    for (const pattern of ATOM_FORBIDDEN) {
      if (content.includes(pattern)) {
        violations.push(
          `[Atom Boundary] atoms/${name}: forbidden use of '${pattern}' — atoms must have zero reactive state`
        )
      }
    }
  }
}

function checkMolecules() {
  const moleculeDir = join(COMPONENTS_DIR, 'molecules')
  const files = getVueFiles(moleculeDir)

  for (const file of files) {
    const name = basename(file)

    // Check naming convention
    if (!name.startsWith('M')) {
      violations.push(`[Naming] molecules/${name}: molecule components must start with 'M'`)
    }

    const content = readVueFile(file)

    // Check for forbidden imports
    for (const pattern of MOLECULE_FORBIDDEN_IMPORTS) {
      // Detect import statements from forbidden tiers
      const importRegex = new RegExp(`from\\s+['"][^'"]*${pattern}[^'"]*['"]`)
      if (importRegex.test(content)) {
        violations.push(
          `[Molecule Boundary] molecules/${name}: must not import from '${pattern}'`
        )
      }
    }

    // Check for forbidden API/router calls
    for (const pattern of MOLECULE_FORBIDDEN_CALLS) {
      if (content.includes(pattern)) {
        violations.push(
          `[Molecule Boundary] molecules/${name}: forbidden use of '${pattern}' — molecules must not make API calls or use router`
        )
      }
    }
  }
}

function checkOrganisms() {
  const organismDir = join(COMPONENTS_DIR, 'organisms')
  const files = getVueFiles(organismDir)

  for (const file of files) {
    const name = basename(file)

    // Check naming convention only
    if (!name.startsWith('O')) {
      violations.push(`[Naming] organisms/${name}: organism components must start with 'O'`)
    }
  }
}

// Run checks
checkAtoms()
checkMolecules()
checkOrganisms()

if (violations.length === 0) {
  console.log('✅ Atomic tier boundary check passed — all components comply.\n')
  process.exit(0)
} else {
  console.error(`\n❌ Atomic tier boundary violations found (${violations.length}):\n`)
  for (const v of violations) {
    console.error(`  • ${v}`)
  }
  console.error()
  process.exit(1)
}
