# Requirements Document

## Introduction

Money Conversion SPA is a Nuxt 4 statically-generated progressive web application designed to convert internet users who want to focus on making money. The application provides curated external money-making resource links managed by an admin, wrapped in a viral conversion-optimized interface that leverages social currency, triggers, emotion, public visibility, practical value, and storytelling to maximize user engagement and sharing. The app is built with atomic component architecture (Atoms/Molecules/Organisms), Material Design 3 tonal color system via Tailwind v4, full i18n support (English, Spanish, Amharic), offline-first PWA capabilities, and WCAG 2.2 AA accessibility compliance.

## Glossary

- **App**: The Money Conversion SPA Nuxt 4 application
- **Admin_Panel**: The authenticated content management interface where the site owner uploads and curates external resource links
- **Content_Block**: A curated collection of external money-making website links with metadata (title, description, category, URL, thumbnail)
- **Resource_Link**: An individual external website link deemed worth the user's time, stored with associated metadata
- **Visitor**: An unauthenticated user browsing the public-facing application
- **Admin**: The authenticated site owner who manages content blocks and resource links
- **Toast_System**: A notification overlay component that displays transient success, error, warning, and informational messages to the user
- **Install_Prompt**: The PWA installation dialog presented to eligible users who have not previously dismissed it
- **Service_Worker**: The background process that manages offline caching, asset precaching, and automatic updates
- **Theme_Engine**: The runtime system that generates Material Design 3 tonal color palettes from primary and secondary seed hex values
- **Atomic_Tier**: The classification system for components — Atoms (pure render), Molecules (local UI state), Organisms (full power with stores and APIs)
- **Viral_Principle**: One of six conversion psychology frameworks (Social Currency, Triggers, Emotion, Public, Practical Value, Stories) that each organism must map to
- **Linter**: ESLint configured with Vue and TypeScript rules that statically analyzes code for errors, style violations, and best practice deviations
- **Formatter**: Prettier configured as the single source of truth for code formatting (indentation, quotes, semicolons, line length)
- **Form_Validation**: The client-side and submission-time validation system that validates all user inputs against defined rules before persisting data, providing real-time inline feedback and preventing invalid submissions
- **Input_Sanitization**: The security layer that strips, encodes, or rejects malicious content (HTML injection, XSS payloads, protocol attacks) from all user-supplied inputs before rendering or persistence
- **Secure_Email**: Email communication transmitted exclusively over HTTPS/TLS 1.2+ to a third-party email service API, with DKIM/SPF/DMARC alignment and rate limiting

## Requirements

### Requirement 1: Admin Content Management

**User Story:** As an Admin, I want to upload and curate links to external money-making websites, so that Visitors can discover vetted resources worth their time.

#### Acceptance Criteria

1. WHEN the Admin authenticates successfully, THE Admin_Panel SHALL display the content management dashboard with all existing Resource_Links
2. WHEN the Admin submits a new Resource_Link with title (maximum 100 characters), description (maximum 500 characters), category, URL (maximum 2048 characters), and optional thumbnail, THE Admin_Panel SHALL validate all required fields are non-empty and within length limits, then persist the Resource_Link
3. WHEN the Admin edits an existing Resource_Link, THE Admin_Panel SHALL update the stored metadata and reflect changes on the public site after regeneration
4. WHEN the Admin deletes a Resource_Link, THE Admin_Panel SHALL present a confirmation dialog before removal, then remove the link from storage and confirm deletion via the Toast_System
5. IF the Admin submits a Resource_Link with a URL that does not begin with https:// or does not conform to valid URL syntax, THEN THE Admin_Panel SHALL display a validation error via the Toast_System without persisting the entry
6. WHEN the Admin reorders Resource_Links within a Content_Block, THE Admin_Panel SHALL persist the new display order
7. IF the Admin submits a Resource_Link with any required field (title, description, category, or URL) left empty or exceeding its maximum length, THEN THE Admin_Panel SHALL display a field-specific validation error via the Toast_System and SHALL NOT persist the entry
8. WHEN the Admin submits a new Resource_Link with a thumbnail, THE Admin_Panel SHALL accept image files only (JPEG, PNG, WebP) with a maximum file size of 2 MB

### Requirement 2: Public Resource Display

**User Story:** As a Visitor, I want to browse curated money-making resources organized by category, so that I can find relevant opportunities quickly.

#### Acceptance Criteria

1. WHEN a Visitor navigates to the resources page, THE App SHALL display all published Resource_Links grouped by category in the Admin-defined display order
2. THE App SHALL render each Resource_Link as a card showing title, description (truncated to a maximum of 150 characters with an ellipsis when exceeded), category badge, and thumbnail
3. WHEN a Visitor selects a Resource_Link card via click or keyboard activation, THE App SHALL open the external URL in a new browser tab with `rel="noopener noreferrer"`
4. WHILE the App is loading Resource_Links, THE App SHALL display a skeleton loading state with `aria-busy="true"` set on the resource list container and removed once loading completes
5. IF no Resource_Links exist for a category, THEN THE App SHALL display an empty state message for that category
6. IF a Resource_Link has no thumbnail or the thumbnail fails to load, THEN THE App SHALL display a category-specific placeholder image with an empty `alt` attribute

### Requirement 3: SEO Configuration

**User Story:** As an Admin, I want the application to have complete SEO metadata, so that the site ranks well in search engines and displays rich previews when shared.

#### Acceptance Criteria

1. THE App SHALL generate Open Graph meta tags (og:title, og:description, og:image, og:url, og:type) for every page
2. THE App SHALL generate a sitemap.xml listing all public routes with appropriate changefreq and priority values
3. THE App SHALL include schema.org structured data (WebSite, Organization) in JSON-LD format on the home page
4. THE App SHALL render locale-specific hreflang alternate tags for all supported languages (en, es, am)
5. WHILE in production mode, THE App SHALL generate OG images for social sharing previews
6. WHILE in development mode, THE App SHALL disable OG image generation to prevent SSR crashes

### Requirement 4: Security Headers

**User Story:** As an Admin, I want the application to serve secure HTTP headers, so that the site is protected against common web vulnerabilities.

#### Acceptance Criteria

1. THE App SHALL serve Content-Security-Policy headers allowing 'self' and 'unsafe-inline' for scripts and styles
2. THE App SHALL configure nuxt-security with `ssg: { hashScripts: false }` to prevent SHA hashes from overriding unsafe-inline on the static site
3. THE App SHALL serve X-Content-Type-Options, X-Frame-Options, and Referrer-Policy headers on all responses
4. THE App SHALL include external CDN origins (Google Fonts, image hosts) in the CSP allowlist
5. IF a CSP violation is detected by a browser, THEN THE App SHALL log the violation to a configured report-uri endpoint

### Requirement 5: Progressive Web App

**User Story:** As a Visitor, I want to install the application on my device and use it offline, so that I can access resources without an internet connection.

#### Acceptance Criteria

1. THE App SHALL register a Service_Worker with `registerType: 'autoUpdate'`, `skipWaiting: true`, and `clientsClaim: true`
2. THE App SHALL precache all build-output static assets (HTML, JS, CSS, and icon files) during the build step
3. WHEN the Visitor loads a page while online, THE Service_Worker SHALL apply NetworkFirst strategy for page requests with a 3-second timeout, falling back to the cached version if the network does not respond within the timeout
4. IF the Visitor navigates to a page that is not available in cache while offline, THEN THE App SHALL display an offline fallback page indicating that the content is unavailable without a connection
5. WHEN the Service_Worker intercepts a request for a hashed JS or CSS bundle (a filename containing a content-hash segment), THE Service_Worker SHALL apply CacheFirst strategy with a maximum cache expiration of 365 days
6. WHEN the Service_Worker intercepts a request for an image resource, THE Service_Worker SHALL apply CacheFirst strategy with a 30-day expiration and a maximum of 60 cached entries
7. WHEN the Service_Worker intercepts a request for a translation JSON file, THE Service_Worker SHALL apply StaleWhileRevalidate strategy
8. WHEN a new Service_Worker version is available, THE App SHALL activate the update silently without requiring user interaction
9. WHEN the Visitor has not previously dismissed the Install_Prompt and the browser fires `beforeinstallprompt`, THE App SHALL display a fixed-position install banner within 1 second of the event
10. WHEN the Visitor dismisses the Install_Prompt, THE App SHALL persist the dismissal in localStorage and suppress future install prompts for the duration of the stored value
11. WHILE the App is running in standalone display mode, THE App SHALL hide the Install_Prompt
12. THE App SHALL provide a web app manifest with `start_url`, `id`, `scope`, `display: standalone`, icons (192px and 512px in `any` purpose, plus a separate maskable icon entry), `theme_color`, and `background_color`

### Requirement 6: Internationalization

**User Story:** As a Visitor, I want to view the application in my preferred language (English, Spanish, or Amharic), so that I can understand all content without language barriers.

#### Acceptance Criteria

1. THE App SHALL support three locales: English (en, default), Spanish (es), and Amharic (am)
2. THE App SHALL use `prefix_except_default` routing strategy so English routes have no prefix while Spanish uses `/es/` and Amharic uses `/am/`
3. THE App SHALL lazy-load locale JSON files to minimize initial bundle size
4. WHEN a Visitor selects a different language, THE App SHALL update all visible text, the `<html lang>` attribute, and the document direction without a full page reload
5. THE App SHALL generate hreflang alternate link tags for all supported locales on every page
6. THE App SHALL avoid using `bundle: { dropMessageCompiler: true }` to preserve interpolated message support

### Requirement 7: Toast Notification System

**User Story:** As a Visitor, I want to receive clear feedback for my actions through toast notifications, so that I understand the outcome of operations without page disruption.

#### Acceptance Criteria

1. WHEN a user action succeeds (form submission, link copy, install prompt interaction), THE Toast_System SHALL display a success toast with a message indicating the completed action
2. IF a user action fails (network error, validation failure), THEN THE Toast_System SHALL display an error toast with a message indicating the failure reason and a suggested corrective action
3. THE Toast_System SHALL render error toasts in a container with `role="alert"` and `aria-live="assertive"`
4. THE Toast_System SHALL render informational and success toasts with `aria-live="polite"`
5. WHEN a toast is displayed, THE Toast_System SHALL auto-dismiss the toast after 5 seconds unless the user hovers over or moves keyboard focus to the toast, in which case the auto-dismiss timer SHALL pause and resume from the remaining time once hover or focus is removed
6. THE Toast_System SHALL allow keyboard dismissal via Escape key and provide a visible close button meeting the 44px minimum touch target
7. WHEN multiple toasts are triggered before prior toasts are dismissed, THE Toast_System SHALL stack toasts vertically with a maximum of 3 visible toasts, with the newest toast appearing at the end of the stack
8. THE Toast_System SHALL render toasts in a fixed-position container anchored to the bottom-center of the viewport, positioned above interactive page content so as not to obscure primary actions

### Requirement 8: Viral Conversion Design — Social Currency

**User Story:** As a Visitor, I want to feel like an insider discovering exclusive money-making knowledge, so that I am motivated to share the app with my network.

#### Acceptance Criteria

1. THE App SHALL display a leaderboard organism showing top-shared resources with rank indicators and `role="list"` markup
2. THE App SHALL award visible achievement badges to Visitors who complete engagement milestones (first share, profile setup, referral)
3. WHEN a Visitor earns a new badge, THE App SHALL announce the achievement via the Toast_System and an `aria-live` region
4. THE App SHALL present gated premium content sections that unlock after social sharing actions, using `aria-expanded` to communicate state

### Requirement 9: Viral Conversion Design — Triggers

**User Story:** As a Visitor, I want contextual reminders that keep this resource top-of-mind, so that I return regularly and share with others.

#### Acceptance Criteria

1. THE App SHALL display a notification bar organism with contextual time-based messages (morning motivation, end-of-week summary) using `role="alert"`
2. WHEN a Visitor returns to the site, THE App SHALL display a personalized welcome-back message referencing their last activity
3. THE App SHALL provide a daily check-in organism with a progress indicator using `role="progressbar"` and `aria-valuenow`
4. WHEN a Visitor completes a daily check-in, THE App SHALL confirm progress via the Toast_System

### Requirement 10: Viral Conversion Design — Emotion

**User Story:** As a Visitor, I want to feel excitement and urgency about money-making opportunities, so that I take immediate action and share with others.

#### Acceptance Criteria

1. THE App SHALL provide an income calculator organism that computes potential earnings and announces results via `aria-live="polite"`
2. THE App SHALL display countdown timers for limited-time featured resources using `role="timer"` with accessible labels
3. THE App SHALL present pain-point sections contrasting the status quo with available opportunities using semantic heading hierarchy
4. WHEN the income calculator produces a result, THE App SHALL highlight the value with high-arousal visual emphasis (scale animation respecting `prefers-reduced-motion`)

### Requirement 11: Viral Conversion Design — Public Visibility

**User Story:** As a Visitor, I want to see that other people are actively using and sharing this app, so that I feel confident in its value and share it myself.

#### Acceptance Criteria

1. THE App SHALL display a social proof molecule showing active user count and recent user avatars with descriptive `alt` text
2. THE App SHALL render a live activity feed organism showing recent user actions using `aria-live="polite"` with throttled updates (maximum one announcement per 10 seconds)
3. THE App SHALL provide shareable badge graphics that Visitors can post to social media, with share actions labeled accessibly
4. WHEN a Visitor triggers a share action, THE App SHALL open the platform share dialog and confirm completion via the Toast_System

### Requirement 12: Viral Conversion Design — Practical Value

**User Story:** As a Visitor, I want access to genuinely useful free tools and content previews, so that I find immediate value and share tips with others.

#### Acceptance Criteria

1. THE App SHALL provide a free toolkit organism with keyboard-operable interactive tools (calculators, checklists, templates)
2. THE App SHALL render content preview cards with expandable detail sections using `aria-expanded` state communication
3. THE App SHALL generate shareable summary cards for individual resources that Visitors can copy to clipboard
4. WHEN a Visitor copies a shareable card, THE App SHALL confirm the copy action via the Toast_System

### Requirement 13: Viral Conversion Design — Stories

**User Story:** As a Visitor, I want to read compelling success stories that demonstrate real money-making results, so that I am inspired to act and share these narratives.

#### Acceptance Criteria

1. THE App SHALL display a founder story organism as a semantic `<article>` with proper heading hierarchy and captioned images
2. THE App SHALL render user success stories with before/after comparisons that do not rely solely on color to convey meaning
3. THE App SHALL present case study organisms with long-form content using correct heading levels (h2, h3, h4) and `aria-labelledby` on sections
4. WHEN a Visitor reaches the end of a story, THE App SHALL present contextual share and CTA options

### Requirement 14: Atomic Component Architecture

**User Story:** As a developer, I want all components to follow strict atomic design tier boundaries, so that the codebase remains maintainable, testable, and predictable.

#### Acceptance Criteria

1. THE App SHALL organize components into three directories: `components/atoms/`, `components/molecules/`, `components/organisms/`
2. THE App SHALL prefix all atom components with `A` (AButton, AIcon, AText), molecules with `M` (MCard, MFormField), and organisms with `O` (OHeroSection, ONavbar)
3. THE App SHALL enforce that atom components contain zero reactive state (`ref`, `reactive`), no store imports (`usePinia`, `useStore`, `useState`), no lifecycle hooks (`onMounted`, `onUnmounted`, `onBeforeMount`), and no watchers (`watch`, `watchEffect`), while permitting `computed` derived solely from the component's own props
4. THE App SHALL enforce that molecule components import only from the `components/atoms/` directory and contain only local UI state (limited to `ref()` for visual coordination such as open/closed, focused, or selected states), with no store access, no API calls (`useFetch`, `useAsyncData`, `$fetch`), and no router usage (`useRoute`, `useRouter`, `navigateTo`)
5. THE App SHALL enforce that organism components render a visible loading indicator, an error message, and an empty-state placeholder for each asynchronous data source they consume, such that each state is distinguishable in the rendered DOM
6. IF a component violates tier boundaries (atom importing a store, molecule calling an API, molecule importing from molecules or organisms, or any component missing its tier prefix), THEN THE App SHALL fail the automated lint or CI check, blocking the merge until the violation is resolved

### Requirement 15: Material Design 3 Color System

**User Story:** As a developer, I want a systematic color palette generated from seed colors, so that the entire UI maintains visual harmony across light and dark modes.

#### Acceptance Criteria

1. THE Theme_Engine SHALL generate tonal palettes with stops at values 0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, and 100 for primary, secondary, tertiary, neutral, neutral-variant, and error color roles from three seed hex values (primary, secondary, tertiary) defined in `package.json` under `"theme"`
2. THE App SHALL inject M3 color tokens as CSS custom properties on the `:root` selector for light mode and the `.dark` selector for dark mode, covering at minimum the following roles: primary, on-primary, primary-container, on-primary-container, secondary, on-secondary, secondary-container, on-secondary-container, tertiary, on-tertiary, tertiary-container, on-tertiary-container, error, on-error, error-container, on-error-container, surface, on-surface, surface-variant, on-surface-variant, outline, outline-variant, inverse-surface, inverse-on-surface, and inverse-primary
3. THE App SHALL map all M3 CSS custom properties to Tailwind v4 utility classes via a `@theme` block in `main.css`
4. THE App SHALL use `@tailwindcss/vite` plugin directly in nuxt.config.ts without any `tailwind.config.ts` file
5. THE App SHALL wrap dark mode toggle controls in `<ClientOnly>` components to prevent hydration mismatch between server and client state
6. THE App SHALL ensure that all foreground-to-background color pairings assigned to M3 semantic roles (e.g., on-primary over primary, on-surface over surface) meet WCAG 2.2 AA contrast ratios of at least 4.5:1 for text smaller than 24px and at least 3:1 for text 24px or larger and for non-text UI components, in both light and dark mode
7. IF a seed hex value defined in `package.json` is not a valid 6-character hexadecimal color code, THEN THE Theme_Engine SHALL exit with a non-zero status code and an error message indicating which seed value is invalid

### Requirement 16: Accessibility Compliance

**User Story:** As a Visitor with disabilities, I want the application to be fully usable with assistive technologies, so that I can access all content and functionality without barriers.

#### Acceptance Criteria

1. THE App SHALL provide a skip-to-content link that is visually hidden until focused via keyboard, targeting `<main id="main-content" tabindex="-1">`
2. WHEN a route change completes, THE App SHALL move focus to the main content region within 300 milliseconds of the new page rendering
3. THE App SHALL render all interactive elements with visible `focus-visible` indicators (minimum 2px ring, 3:1 contrast against adjacent colors)
4. THE App SHALL use semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) each with an `aria-label` that uniquely identifies the landmark's purpose (e.g., "Primary navigation", "Site footer")
5. THE App SHALL ensure all form inputs have associated `<label>` elements or `aria-label`, plus `aria-describedby` for help text and `aria-invalid` with `aria-errormessage` for error states
6. IF the user has `prefers-reduced-motion: reduce` enabled, THEN THE App SHALL disable all CSS transitions, transforms, and keyframe animations except opacity changes required for content visibility using Tailwind `motion-safe:` and `motion-reduce:` variants
7. THE App SHALL ensure all touch targets measure a minimum of 44×44 CSS pixels
8. THE App SHALL set the `lang` attribute on `<html>` matching the active locale and use `lang` attributes on any content in a different language
9. WHEN dynamic content updates occur (loading states, form validation results, or asynchronous data changes), THE App SHALL announce the update to assistive technologies using an `aria-live` region with politeness level `polite` for non-urgent updates and `assertive` for error notifications
10. THE App SHALL provide a text alternative for all non-decorative images via the `alt` attribute, with decorative images marked using `alt=""` or `role="presentation"`
11. THE App SHALL ensure text content meets WCAG 2.1 AA color contrast ratios: minimum 4.5:1 for normal text (below 24px or 18.66px bold) and minimum 3:1 for large text (24px and above, or 18.66px bold and above)

### Requirement 17: Testing Infrastructure

**User Story:** As a developer, I want comprehensive automated testing coverage, so that regressions are caught before deployment.

#### Acceptance Criteria

1. THE App SHALL have Vitest installed as a devDependency and configured with Vue Test Utils so that unit tests execute successfully via a single command
2. THE App SHALL have Playwright installed as a devDependency and configured for Chromium, Firefox, and WebKit browsers so that end-to-end tests execute successfully via a single command
3. WHEN a unit test is run against an atom component, THE test SHALL verify that given props produce the expected rendered DOM output, that user interactions emit the expected events with correct payloads, and that required ARIA attributes (role, aria-label, aria-describedby) are present in the rendered markup
4. WHEN an end-to-end test validates a user flow, THE test SHALL assert that all interactive elements are reachable via Tab key in logical order, that focus moves to the expected element after route changes or modal openings, and that dynamic content updates are exposed to assistive technology via aria-live regions
5. THE App SHALL maintain a `test:unit` script in `package.json` that executes `vitest run` and a `test:e2e` script that executes `playwright test`, both returning exit code 0 on success and non-zero on any test failure
6. WHEN unit tests are executed, THE test suite SHALL achieve a minimum of 80% line coverage across all atom components as reported by Vitest's coverage reporter
7. IF a test command is run and no test files matching the expected pattern are found, THEN THE test runner SHALL exit with a non-zero exit code indicating no tests were discovered

### Requirement 18: Dependency Security

**User Story:** As a developer, I want all project dependencies screened for known vulnerabilities, so that the application does not ship with exploitable packages.

#### Acceptance Criteria

1. WHEN a new dependency is added to the project, THE App SHALL run `npm audit` and report any vulnerabilities with severity high or critical to the terminal output, including the package name, severity level, and advisory URL for each finding
2. THE App SHALL pin all production dependencies to exact versions in `package.json` (no caret or tilde ranges)
3. IF `npm audit` reports a high or critical vulnerability in a direct or transitive dependency, THEN THE App SHALL terminate the build process with a non-zero exit code and output an error message indicating which packages have unresolved vulnerabilities, until the vulnerable package is updated to a version without the reported vulnerability or an explicit override is documented in `SECURITY.md`
4. THE App SHALL document any accepted vulnerability overrides in a `SECURITY.md` file, with each entry containing the package name, vulnerability identifier, severity level, reason for acceptance, and planned remediation date
5. IF `npm audit` fails to complete due to a network error or registry unavailability, THEN THE App SHALL terminate the build process with a non-zero exit code and output an error message indicating that the vulnerability check could not be performed

### Requirement 19: Code Quality — Linting and Formatting

**User Story:** As a developer, I want consistent code style and static analysis enforced automatically, so that the codebase remains clean, readable, and easy to understand across contributors.

#### Acceptance Criteria

1. THE App SHALL configure ESLint with `@nuxt/eslint-config` for Vue 3, TypeScript, and Nuxt-specific rules
2. THE App SHALL configure Prettier as the sole code formatter with project-wide settings (single quotes, no semicolons, 2-space indent, 100-character print width)
3. THE App SHALL integrate `eslint-config-prettier` to disable ESLint rules that conflict with Prettier formatting
4. WHEN a developer runs the lint script, THE Linter SHALL report all style violations, unused variables, type errors, and accessibility lint issues without auto-fixing
5. WHEN a developer runs the format script, THE Formatter SHALL rewrite all source files to match the configured style rules
6. THE App SHALL include `lint` and `format` scripts in `package.json` executing `eslint .` and `prettier --write .` respectively
7. THE App SHALL include a `.prettierrc` configuration file and an `.eslintrc` or `eslint.config.mjs` configuration file at the project root
8. THE App SHALL configure ESLint to enforce Vue accessibility rules via `eslint-plugin-vuejs-accessibility`

### Requirement 20: Form Validation

**User Story:** As a Visitor or Admin, I want all forms to validate my input in real-time and on submission, so that I receive immediate, clear feedback on errors and cannot submit invalid data.

#### Acceptance Criteria

1. THE App SHALL validate all form fields on blur (when the user leaves a field) and on form submission, displaying inline error messages beneath the offending field within 100 milliseconds of the triggering event
2. THE App SHALL prevent form submission if any required field is empty, any field exceeds its maximum character length, or any field fails its format validation rule (e.g., URL, email)
3. WHEN a form field fails validation, THE App SHALL render the field with `aria-invalid="true"`, associate the error message element via `aria-errormessage`, and announce the error to screen readers via an `aria-live="assertive"` region
4. WHEN a previously invalid field is corrected by the user, THE App SHALL remove the error state, clear `aria-invalid`, and remove the error message within 100 milliseconds of the field value meeting its validation rule
5. THE App SHALL validate URL fields against the pattern `https://` prefix and valid URL syntax per the WHATWG URL Standard, rejecting `http://`, protocol-relative, and non-URL strings
6. THE App SHALL validate email fields against RFC 5322 simplified format (local@domain.tld) with a minimum domain of two characters
7. THE App SHALL enforce maximum character limits per field type: title (100), description (500), URL (2048), email (254), and display a remaining character count when the user has typed past 80% of the limit
8. THE App SHALL enforce minimum character limits where applicable: title (3), description (10), rejecting fields that do not meet the minimum on submission
9. THE App SHALL validate file upload fields (thumbnails) by checking MIME type (image/jpeg, image/png, image/webp) and file size (maximum 2 MB), displaying a specific error if the file type is wrong or the file is too large
10. THE App SHALL display all validation error messages in the active locale (English, Spanish, or Amharic) using i18n translation keys
11. THE App SHALL support the following validation states per field: pristine (untouched, no error shown), dirty (touched, validation runs), valid (passes all rules, success indicator shown), and invalid (fails a rule, error message shown)
12. IF the form submission is blocked by validation errors, THEN THE App SHALL scroll to and focus the first invalid field, and announce a summary count of errors via the Toast_System (e.g., "3 fields need attention")
13. THE App SHALL sanitize all text inputs by trimming leading and trailing whitespace before validation and before persistence
14. THE App SHALL implement all validation logic in a reusable composable (`useFormValidation`) so that validation rules are defined declaratively per form and can be unit-tested independently of component rendering

### Requirement 21: Input Sanitization and Secure Communication

**User Story:** As a developer, I want all user inputs sanitized against injection attacks and all email communications sent over secure channels, so that the application is protected from XSS, injection exploits, and data interception.

#### Acceptance Criteria

1. THE App SHALL sanitize all user-submitted text inputs by stripping HTML tags and script content before rendering or persisting, using a dedicated `sanitizeInput` utility function that removes `<script>`, `<iframe>`, `<object>`, `<embed>`, `<link>`, `<style>`, event handler attributes (onclick, onerror, onload, etc.), and `javascript:` protocol URIs
2. THE App SHALL encode all user-supplied strings for HTML context using entity encoding (`<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`, `"` → `&quot;`, `'` → `&#x27;`) before inserting into DOM via any mechanism other than Vue's default text interpolation (which auto-escapes)
3. THE App SHALL NEVER use `v-html` with user-supplied or untrusted content; if rich text display is required, THE App SHALL use a sanitization library (DOMPurify) with a strict allowlist of tags (p, strong, em, a, ul, ol, li, br) and attributes (href with https:// only, target, rel)
4. THE App SHALL validate and sanitize URL inputs by rejecting any URL containing `javascript:`, `data:`, `vbscript:`, or any protocol other than `https://`, and by encoding special characters in the URL path and query parameters
5. THE App SHALL reject any form input containing null bytes (`\0`), control characters (U+0000 through U+001F except tab, newline, carriage return), or excessively long Unicode sequences (any single field exceeding its defined maximum byte length by 4x)
6. WHEN the App sends transactional emails (lead capture confirmation, admin notifications), THE App SHALL transmit all email via a third-party email service API over HTTPS/TLS 1.2 or higher, rejecting any connection that falls back to unencrypted transport
7. THE App SHALL validate the recipient email address server-side before dispatching any email, rejecting addresses that fail RFC 5322 format validation or contain known disposable email domains (configurable blocklist)
8. THE App SHALL set email headers including `X-Mailer`, `List-Unsubscribe`, and DKIM/SPF/DMARC-aligned sender domain to prevent deliverability issues and spoofing
9. THE App SHALL rate-limit email-triggering form submissions to a maximum of 3 submissions per IP address per 15-minute window, returning a 429 status and displaying a Toast_System warning if the limit is exceeded
10. THE App SHALL log all sanitization rejections (stripped tags, blocked URLs, rate-limit hits) to a server-side audit log with timestamp, IP address (hashed), field name, and rejection reason, without logging the raw malicious input content
11. THE App SHALL implement all sanitization logic in a reusable utility module (`utils/sanitize.ts`) that exports pure functions independently testable via unit tests
12. IF any sanitization rule modifies the user's input (stripping tags, encoding), THEN THE App SHALL NOT notify the user — the sanitized value SHALL be persisted silently; validation errors are only shown for format/length violations, not for stripped content
