#!/usr/bin/env node
/**
 * Atomic Tier Boundary Linter
 * 
 * Enforces strict tier boundaries for atomic component architecture:
 * - Atoms (A-prefix): no ref(, reactive(, watch(, lifecycle hooks, store imports
 * - Molecules (M-prefix): imports only from atoms/, no API calls, no router
 * - Organisms (O-prefix): full power (can import from atoms, molecules, stores, API, router)
 * 
 * All components must have correct tier prefix (A/M/O)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Patterns to detect violations
const VIOLATION_PATTERNS = {
  // Atoms should not use these reactive patterns
  atomForbidden: [
    /\bref\s*\(/,
    /\breactive\s*\(/,
    /\bwatch\s*\(/,
    /\bonMounted\s*\(/,
    /\bonUnmounted\s*\(/,
    /\bonBeforeMount\s*\(/,
    /\bonBeforeUnmount\s*\(/,
    /\bonUpdated\s*\(/,
    /\bonBeforeUpdate\s*\(/,
    /\bonActivated\s*\(/,
    /\bonDeactivated\s*\(/,
    /\buseStore\s*\(/,
    /\buseResourcesStore\s*\(/,
    /\buseAuthStore\s*\(/,
    /\busePwaInstall\s*\(/,
    /\buseDarkMode\s*\(/,
    /from ['"]#stores['"]/,
    /from ['"]@\/stores['"]/,
    /import.*from ['"].*\/stores\//,
  ],
  
  // Molecules should not use these patterns
  moleculeForbidden: [
    /\buseResourcesStore\s*\(/,
    /\buseAuthStore\s*\(/,
    /\buseStore\s*\(/,
    /from ['"]#stores['"]/,
    /from ['"]@\/stores['"]/,
    /import.*from ['"].*\/stores\//,
    /\buseRouter\s*\(/,
    /\buseRoute\s*\(/,
    /\buseLocalePath\s*\(/,
    /\buseLocaleHead\s*\(/,
    /\buseI18n\s*\(/,
    /from ['"]#apis['"]/,
    /from ['"]@\/apis['"]/,
    /import.*from ['"].*\/apis\//,
    /fetch\s*\(/,
    /\$fetch\s*\(/,
    /axios\.|axios\s*\(/,
    /\.get\s*\(/,
    /\.post\s*\(/,
    /\.put\s*\(/,
    /\.delete\s*\(/,
  ],
}

// Tier patterns
const TIER_PREFIXES = {
  A: 'atom',
  M: 'molecule',
  O: 'organism',
}

function getComponentTier(filename) {
  const basename = path.basename(filename, '.vue')
  const tierPrefix = basename[0]
  return TIER_PREFIXES[tierPrefix] || null
}

function checkFile(filePath, content) {
  const violations = []
  const tier = getComponentTier(filePath)
  
  if (!tier) {
    // Not an atomic tier component, skip
    return violations
  }
  
  const forbiddenPatterns = VIOLATION_PATTERNS[tier === 'atom' ? 'atomForbidden' : 'moleculeForbidden']
  
  if (forbiddenPatterns) {
    for (const pattern of forbiddenPatterns) {
      const matches = content.match(pattern)
      if (matches) {
        const lineNum = content.slice(0, content.indexOf(matches[0])).split('\n').length
        violations.push({
          file: filePath,
          line: lineNum,
          pattern: pattern.toString(),
          message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} (${tier}) cannot use ${pattern}`,
        })
      }
    }
  }
  
  // Check for wrong tier prefix
  const tierName = {
    atom: 'A',
    molecule: 'M',
    organism: 'O',
  }[tier]
  
  if (tier && !basename.startsWith(tierName)) {
    violations.push({
      file: filePath,
      line: 1,
      pattern: 'prefix',
      message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} component should start with ${tierName}-prefix but is ${basename}`,
    })
  }
  
  return violations
}

function scanDirectory(dir, baseDir = dir) {
  const results = []
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
          results.push(...scanDirectory(fullPath, baseDir))
        }
      } else if (entry.isFile() && entry.name.endsWith('.vue')) {
        const content = fs.readFileSync(fullPath, 'utf-8')
        results.push(...checkFile(fullPath, content))
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dir}:`, err.message)
  }
  
  return results
}

function formatViolations(violations) {
  if (violations.length === 0) {
    return '✅ All components pass tier boundary checks'
  }
  
  let output = '❌ Tier boundary violations found:\n\n'
  
  // Group by file
  const byFile = violations.reduce((acc, v) => {
    if (!acc[v.file]) acc[v.file] = []
    acc[v.file].push(v)
    return acc
  }, {})
  
  for (const [file, fileViolations] of Object.entries(byFile)) {
    output += `File: ${path.relative(process.cwd(), file)}\n`
    fileViolations.forEach(v => {
      output += `  Line ${v.line}: ${v.message}\n`
    })
    output += '\n'
  }
  
  return output
}

function main() {
  const componentsDir = path.join(__dirname, '..', 'app', 'components')
  const violations = scanDirectory(componentsDir)
  
  const output = formatViolations(violations)
  console.log(output)
  
  if (violations.length > 0) {
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default { scanDirectory, checkFile, formatViolations }