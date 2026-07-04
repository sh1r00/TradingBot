# Security — Accepted Vulnerability Overrides

This file documents known dependency vulnerabilities that have been reviewed and explicitly accepted. Each entry records why the vulnerability is tolerated and when remediation is planned.

If `npm audit` reports a high or critical vulnerability, the build will fail unless the affected package is either updated or documented here as an accepted override.

## Accepted Overrides

| Package Name | Vulnerability ID | Severity | Reason for Acceptance | Planned Remediation Date |
|---|---|---|---|---|
| _playwright_ | _GHSA-7mvr-c777-76hp_ | _high_ | _Test-only dependency; no runtime exposure; only used for E2E testing in local CI environment_ | _2025-12-01_ |

<!-- Add new entries above this line -->

## How to Add an Override

1. Identify the vulnerability from `npm audit` output (package name, advisory URL, severity).
2. Assess whether the vulnerability is exploitable in the context of this project.
3. Add a row to the table above with:
   - **Package Name** — the npm package containing the vulnerability
   - **Vulnerability ID** — the CVE or GHSA identifier (e.g., `CVE-2024-12345` or `GHSA-abcd-efgh-ijkl`)
   - **Severity** — `low`, `moderate`, `high`, or `critical`
   - **Reason for Acceptance** — brief justification for why this is safe to ship
   - **Planned Remediation Date** — target date to resolve (upgrade, replace, or remove)
4. Commit the change alongside any related build configuration updates.

## Review Cadence

Accepted overrides should be reviewed monthly. Remove entries once the vulnerability is resolved.
