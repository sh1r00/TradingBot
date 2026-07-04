#!/usr/bin/env node
/**
 * npm audit security check script.
 * Runs `npm audit --json`, parses for high/critical vulnerabilities,
 * and checks SECURITY.md for accepted overrides.
 *
 * Exits non-zero if unaccepted high/critical vulns found,
 * or if `npm audit` itself fails with a network error.
 *
 * Requirements: 18.1, 18.3, 18.5
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')

/**
 * Parse accepted vulnerability overrides from SECURITY.md.
 * Looks for lines like:
 *   | package-name | CVE-2024-XXXX | high | reason | date |
 */
function parseAcceptedOverrides() {
  const securityPath = join(ROOT, 'SECURITY.md')
  const overrides = new Set()

  if (!existsSync(securityPath)) {
    return overrides
  }

  try {
    const content = readFileSync(securityPath, 'utf-8')
    const lines = content.split('\n')

    for (const line of lines) {
      // Clean Windows line endings and whitespace
      const cleanLine = line.replace(/\r$/, '').trim()
      
      // Skip empty lines, separator rows, and header rows
      if (!cleanLine) continue
      if (cleanLine.startsWith('| -')) continue
      if (cleanLine.includes('Vulnerability ID') || cleanLine.includes('Package Name')) continue
      
      // Match table rows: | package | ID | severity | reason | date |
      // Handle underscore-wrapped values like | _playwright_ | _GHSA-7mvr-c777-76hp_ |
      const match = cleanLine.match(/\|\s*_?([^|_]+)_?\s*\|\s*_?([^|_]+)_?\s*\|\s*_?([^|_]+)_?\s*\|\s*_?([^|_]+)_?\s*\|\s*_?([^|_]+)_?\s*\|/)
      if (match) {
        const pkg = match[1].trim()
        const id = match[2].trim()
        // Skip header rows and rows where ID is empty
        if (id && !id.toLowerCase().includes('vulnerability') && id !== '---') {
          overrides.add(id.toUpperCase())
        }
      }
    }
  } catch (err) {
    // SECURITY.md unreadable — no overrides
    console.error(`Warning: Could not read SECURITY.md: ${err.message}`)
  }

  return overrides
}

function main() {
  console.log('🔍 Running npm audit...\n')

  let auditOutput
  let auditExitCode = 0

  try {
    auditOutput = execSync('npm audit --json', {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  } catch (err) {
    // npm audit exits non-zero when vulnerabilities are found — that's expected
    if (err.stdout) {
      auditOutput = err.stdout
      auditExitCode = err.status || 1
    } else {
      // Network error or npm not available
      console.error('❌ npm audit failed to run (network error or npm unavailable)')
      console.error(err.message)
      process.exit(1)
    }
  }

  let auditData
  try {
    auditData = JSON.parse(auditOutput)
  } catch {
    console.error('❌ Failed to parse npm audit JSON output')
    process.exit(1)
  }

  // npm audit v7+ format: auditData.vulnerabilities
  // npm audit v6 format: auditData.advisories
  const vulnerabilities = auditData.vulnerabilities || {}
  const advisories = auditData.advisories || {}

  const acceptedOverrides = parseAcceptedOverrides()
  const violations = []

  // Process v7+ format
  for (const [pkgName, vuln] of Object.entries(vulnerabilities)) {
    const severity = vuln.severity
    if (severity === 'high' || severity === 'critical') {
      const viaIds = (vuln.via || [])
        .filter((v) => typeof v === 'object')
        .map((v) => String(v.source || '').toUpperCase())

      const isAccepted = viaIds.some((id) => acceptedOverrides.has(id))

      if (!isAccepted) {
        violations.push({
          package: pkgName,
          severity,
          advisoryUrl: vuln.via?.[0]?.url || 'N/A',
        })
      }
    }
  }

  // Process v6 format
  for (const [id, advisory] of Object.entries(advisories)) {
    const severity = advisory.severity
    if (severity === 'high' || severity === 'critical') {
      const advId = String(id).toUpperCase()
      if (!acceptedOverrides.has(advId)) {
        violations.push({
          package: advisory.module_name,
          severity,
          advisoryUrl: advisory.url || advisory.references || 'N/A',
        })
      }
    }
  }

  if (violations.length === 0) {
    console.log('✅ npm audit passed — no unaccepted high/critical vulnerabilities.\n')
    process.exit(0)
  }

  console.error(`\n❌ Found ${violations.length} unaccepted high/critical vulnerabilit${violations.length === 1 ? 'y' : 'ies'}:\n`)
  for (const v of violations) {
    console.error(`  📦 ${v.package}`)
    console.error(`     Severity: ${v.severity.toUpperCase()}`)
    console.error(`     Advisory: ${v.advisoryUrl}`)
    console.error()
  }
  console.error('To accept a known vulnerability, add it to SECURITY.md.\n')
  process.exit(1)
}

main()
