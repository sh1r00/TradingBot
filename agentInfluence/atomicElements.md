# SKILL: Vue Atomic Component Architecture + Design System

> **Trigger**: Use when building Vue 3 / Nuxt components, pages, or interfaces. Enforces Atomic Design tiers, Material Design 3 tonal color system via Tailwind, accessibility-first rendering, and distinctive visual design that avoids generic AI aesthetics.

---

## Design Philosophy

Before writing ANY component code, commit to a deliberate aesthetic direction:

1. **Purpose** — What conversion goal does this interface serve? Who is the audience?
2. **Tone** — Choose a BOLD direction: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian. Execute with precision.
3. **Differentiation** — What makes this UNFORGETTABLE? One memorable detail per page section.
4. **Accessibility** — Aesthetic choices MUST NOT compromise usability. Beauty and access coexist.

### Anti-Patterns (NEVER DO)

- Generic font stacks (Inter, Roboto, Arial, system-ui as primary display)
- Purple-gradient-on-white (the universal AI slop signature)
- Cookie-cutter card grids with identical rounded corners and drop shadows
- Evenly distributed pastel palettes with no dominant color
- Predictable hero → features → pricing → footer without spatial surprise
- Same design across multiple generations — VARY everything

### Design Imperatives

- **Typography**: Distinctive display font + refined body font. Use Google Fonts or self-hosted. Pair with intent.
- **Color**: Dominant primary with sharp accent. Use the Material Design 3 tonal system (below) for systematic harmony.
- **Motion**: One orchestrated moment per viewport > scattered micro-interactions. Staggered reveals, scroll-triggered entrances, hover states that surprise.
- **Spatial Composition**: Asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space OR controlled density. Never default grids.
- **Atmosphere**: Gradient meshes, noise textures, geometric patterns, layered transparencies, decorative borders, grain overlays. NEVER flat solid backgrounds without purpose.

---

## Material Design 3 Tonal Color System (Tailwind)

All components consume color through a computed tonal palette derived from two user inputs: `primary` and `secondary` hex values. The system generates 13 tonal stops per color role following MD3 specifications.

### Tonal Palette Generation

```typescript
// composables/useTheme.ts
import { computed, ref } from 'vue'
import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
  TonalPalette,
} from '@material/material-color-utilities'

export interface ThemeConfig {
  primary: string   // hex e.g. '#6750A4'
  secondary: string // hex e.g. '#958DA5'
}

export function useTheme(config: ThemeConfig) {
  const primaryArgb = argbFromHex(config.primary)
  const theme = themeFromSourceColor(primaryArgb, [
    { name: 'secondary', value: argbFromHex(config.secondary), blend: true },
  ])

  // Extract tonal palettes
  const tones = [0, 4, 6, 10, 12, 17, 20, 22, 24, 30, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100] as const

  function paletteToTailwind(palette: TonalPalette, prefix: string) {
    const result: Record<string, string> = {}
    for (const tone of tones) {
      result[`${prefix}-${tone}`] = hexFromArgb(palette.tone(tone))
    }
    return result
  }

  const colors = {
    ...paletteToTailwind(TonalPalette.fromInt(primaryArgb), 'primary'),
    ...paletteToTailwind(TonalPalette.fromInt(argbFromHex(config.secondary)), 'secondary'),
    // Derived roles
    ...paletteToTailwind(theme.palettes.neutral, 'neutral'),
    ...paletteToTailwind(theme.palettes.neutralVariant, 'neutral-variant'),
    ...paletteToTailwind(theme.palettes.error, 'error'),
    ...paletteToTailwind(theme.palettes.tertiary, 'tertiary'),
  }

  return { colors, theme }
}
```

### Tailwind Integration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./components/**/*.vue', './pages/**/*.vue', './layouts/**/*.vue'],
  theme: {
    extend: {
      colors: {
        // CSS custom properties injected at runtime by useTheme
        primary: {
          DEFAULT: 'var(--md-primary)',
          on: 'var(--md-on-primary)',
          container: 'var(--md-primary-container)',
          'on-container': 'var(--md-on-primary-container)',
        },
        secondary: {
          DEFAULT: 'var(--md-secondary)',
          on: 'var(--md-on-secondary)',
          container: 'var(--md-secondary-container)',
          'on-container': 'var(--md-on-secondary-container)',
        },
        tertiary: {
          DEFAULT: 'var(--md-tertiary)',
          on: 'var(--md-on-tertiary)',
          container: 'var(--md-tertiary-container)',
          'on-container': 'var(--md-on-tertiary-container)',
        },
        error: {
          DEFAULT: 'var(--md-error)',
          on: 'var(--md-on-error)',
          container: 'var(--md-error-container)',
          'on-container': 'var(--md-on-error-container)',
        },
        surface: {
          DEFAULT: 'var(--md-surface)',
          dim: 'var(--md-surface-dim)',
          bright: 'var(--md-surface-bright)',
          'container-lowest': 'var(--md-surface-container-lowest)',
          'container-low': 'var(--md-surface-container-low)',
          container: 'var(--md-surface-container)',
          'container-high': 'var(--md-surface-container-high)',
          'container-highest': 'var(--md-surface-container-highest)',
        },
        'on-surface': {
          DEFAULT: 'var(--md-on-surface)',
          variant: 'var(--md-on-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--md-outline)',
          variant: 'var(--md-outline-variant)',
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          // Light scheme defaults — overridden at runtime
          '--md-primary': '#6750A4',
          '--md-on-primary': '#FFFFFF',
          '--md-primary-container': '#EADDFF',
          '--md-on-primary-container': '#21005D',
          '--md-secondary': '#625B71',
          '--md-on-secondary': '#FFFFFF',
          '--md-secondary-container': '#E8DEF8',
          '--md-on-secondary-container': '#1D192B',
          '--md-surface': '#FEF7FF',
          '--md-surface-dim': '#DED8E1',
          '--md-surface-bright': '#FEF7FF',
          '--md-surface-container-lowest': '#FFFFFF',
          '--md-surface-container-low': '#F7F2FA',
          '--md-surface-container': '#F3EDF7',
          '--md-surface-container-high': '#ECE6F0',
          '--md-surface-container-highest': '#E6E0E9',
          '--md-on-surface': '#1D1B20',
          '--md-on-surface-variant': '#49454F',
          '--md-outline': '#79747E',
          '--md-outline-variant': '#CAC4D0',
          '--md-error': '#B3261E',
          '--md-on-error': '#FFFFFF',
          '--md-error-container': '#F9DEDC',
          '--md-on-error-container': '#410E0B',
          '--md-tertiary': '#7D5260',
          '--md-on-tertiary': '#FFFFFF',
          '--md-tertiary-container': '#FFD8E4',
          '--md-on-tertiary-container': '#31111D',
        },
        '.dark': {
          '--md-primary': '#D0BCFF',
          '--md-on-primary': '#381E72',
          '--md-primary-container': '#4F378B',
          '--md-on-primary-container': '#EADDFF',
          '--md-secondary': '#CCC2DC',
          '--md-on-secondary': '#332D41',
          '--md-secondary-container': '#4A4458',
          '--md-on-secondary-container': '#E8DEF8',
          '--md-surface': '#141218',
          '--md-surface-dim': '#141218',
          '--md-surface-bright': '#3B383E',
          '--md-surface-container-lowest': '#0F0D13',
          '--md-surface-container-low': '#1D1B20',
          '--md-surface-container': '#211F26',
          '--md-surface-container-high': '#2B2930',
          '--md-surface-container-highest': '#36343B',
          '--md-on-surface': '#E6E0E9',
          '--md-on-surface-variant': '#CAC4D0',
          '--md-outline': '#938F99',
          '--md-outline-variant': '#49454F',
          '--md-error': '#F2B8B5',
          '--md-on-error': '#601410',
          '--md-error-container': '#8C1D18',
          '--md-on-error-container': '#F9DEDC',
          '--md-tertiary': '#EFB8C8',
          '--md-on-tertiary': '#492532',
          '--md-tertiary-container': '#633B48',
          '--md-on-tertiary-container': '#FFD8E4',
        },
      })
    }),
  ],
} satisfies Config
```

### Runtime Theme Injection

```vue
<!-- app.vue or plugins/theme.client.ts -->
<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'
import { useHead } from '#imports'

const { colors } = useTheme({
  primary: '#6750A4',   // User-configurable
  secondary: '#958DA5', // User-configurable
})

// Inject CSS vars at runtime
useHead({
  style: [{ innerHTML: `:root { ${Object.entries(colors).map(([k, v]) => `--md-${k}: ${v}`).join('; ')} }` }],
})
</script>
```

---

## Accessibility-First Contract (WCAG 2.2 AA Minimum)

Accessibility is NOT optional. Every component at every tier MUST satisfy these constraints. This section takes PRIORITY over aesthetic choices — if a design choice breaks access, the design changes.

### Universal Requirements (All Tiers)

| Criterion | Rule | Enforcement |
|-----------|------|-------------|
| Color Contrast | Text on surface: ≥4.5:1 (normal), ≥3:1 (large). UI components: ≥3:1 against adjacent | HARD FAILURE if violated |
| Keyboard Navigation | All interactive elements reachable and operable via keyboard | HARD FAILURE |
| Focus Indicators | Visible focus ring (min 2px, ≥3:1 contrast against adjacent) on ALL focusable elements | HARD FAILURE |
| Semantic HTML | Use correct elements (`<button>`, `<a>`, `<nav>`, `<main>`, `<h1>`–`<h6>`) before ARIA | HARD FAILURE |
| Screen Reader | All images have `alt`, all icons have `aria-label` or `aria-hidden="true"`, form inputs have labels | HARD FAILURE |
| Motion Safety | Respect `prefers-reduced-motion`. Provide `motion-safe:` prefix for Tailwind animations | WARNING |
| Touch Targets | Minimum 44×44px for all interactive elements on touch devices | WARNING |
| Language | `lang` attribute on `<html>` and any content in a different language | HARD FAILURE |

### Tailwind Accessibility Utilities

```html
<!-- Focus visible ring (always use) -->
<button class="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">

<!-- Motion safety -->
<div class="motion-safe:animate-fade-in motion-reduce:opacity-100">

<!-- Screen reader only text -->
<span class="sr-only">Close menu</span>

<!-- Minimum touch target -->
<button class="min-h-[44px] min-w-[44px]">
```

### Color Contrast Validation

```typescript
// utils/a11y.ts
export function contrastRatio(fg: string, bg: string): number {
  const luminance = (hex: string) => {
    const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i + 1, i + 3), 16) / 255)
    const linear = rgb.map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  }
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function meetsAA(fg: string, bg: string, isLargeText = false): boolean {
  const ratio = contrastRatio(fg, bg)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}
```

### ARIA Pattern Library (Per Component Type)

| Component | Required ARIA |
|-----------|--------------|
| Button | `role="button"` (implicit on `<button>`), `aria-pressed` for toggles, `aria-expanded` for menus |
| Link | Descriptive text (no "click here"), `aria-current="page"` for active nav |
| Input | `aria-describedby` for help text, `aria-invalid` + `aria-errormessage` for errors |
| Modal/Dialog | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape closes |
| Accordion | `aria-expanded`, `aria-controls`, `role="region"` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, arrow key navigation |
| Toast/Alert | `role="alert"` or `role="status"`, `aria-live="polite"` or `"assertive"` |
| Loading | `aria-busy="true"` on container, `role="progressbar"` with `aria-valuenow` if determinate |
| Image | Informative: descriptive `alt`. Decorative: `alt=""` + `aria-hidden="true"` |
| Icon Button | `aria-label` describing the action (not the icon name) |

---

## Component Classification Rules

| Tier | State | Side Effects | Dependencies | Directory |
|------|-------|--------------|--------------|-----------|
| Atom | ❌ None | ❌ None | Props only | `components/atoms/` |
| Molecule | ✅ Local UI only | ❌ None | Atoms + props | `components/molecules/` |
| Organism | ✅ Any | ✅ Allowed | Atoms + Molecules + stores/composables | `components/organisms/` |

---

## Atoms

**Stable identities with pure output. The reconciler always skips.**

Atoms are the smallest, most primitive UI building blocks. They receive props, render deterministic output, and never trigger re-renders on their own.

### Rules

- No reactive state (`ref`, `reactive`, `computed` depending on external sources)
- Props in, VNodes out — nothing else
- Use `defineOptions({ inheritAttrs: false })` where appropriate
- No `watch`, no `onMounted` side effects, no event bus listeners
- Emit events up, never mutate anything
- Prefix: `A` (e.g., `AButton`, `AIcon`, `ABadge`)
- MUST use semantic HTML + complete ARIA attributes
- MUST include `focus-visible` ring styles
- MUST use MD3 tonal color tokens (never hardcoded hex/rgb)
- MUST respect `motion-safe:` / `motion-reduce:` for any transitions

### Atom Checklist

```
☐ Zero imports from stores, composables, or APIs
☐ No ref() / reactive() / computed() in <script setup>
☐ No watch() / watchEffect()
☐ No lifecycle hooks with side effects
☐ All dynamic behavior driven by props
☐ Events emitted via defineEmits only
☐ Deterministic render (same props → same output)
☐ Semantic HTML element (not div for everything)
☐ ARIA attributes complete for component role
☐ Focus ring visible on keyboard navigation
☐ Color tokens from MD3 system (not hardcoded)
☐ Touch target ≥44px for interactive atoms
☐ prefers-reduced-motion respected
```

### Example

```vue
<!-- components/atoms/AButton.vue -->
<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2',
      'min-h-[44px] min-w-[44px] px-6 py-3',
      'rounded-full font-medium text-sm tracking-wide',
      'transition-all duration-200 motion-reduce:transition-none',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      'disabled:opacity-38 disabled:pointer-events-none',
      variantClasses,
    ]"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    :aria-busy="loading || undefined"
    :type="type"
    @click="!disabled && !loading && $emit('click', $event)"
  >
    <ASpinner v-if="loading" size="sm" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'filled' | 'outlined' | 'tonal' | 'elevated' | 'text'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  switch (props.variant ?? 'filled') {
    case 'filled':
      return 'bg-primary text-on-primary hover:shadow-md active:scale-[0.98]'
    case 'outlined':
      return 'border border-outline text-primary hover:bg-primary/8 active:bg-primary/12'
    case 'tonal':
      return 'bg-secondary-container text-on-secondary-container hover:shadow-sm active:scale-[0.98]'
    case 'elevated':
      return 'bg-surface-container-low text-primary shadow-sm hover:shadow-md active:scale-[0.98]'
    case 'text':
      return 'text-primary hover:bg-primary/8 active:bg-primary/12'
  }
})
</script>
```

### Common Atoms

| Atom | Purpose | Key A11y |
|------|---------|----------|
| `AButton` | Clickable action | `aria-disabled`, `aria-busy`, focus ring |
| `AIcon` | SVG icon | `aria-hidden="true"` when decorative, `aria-label` when standalone |
| `AText` | Typography (h1–h6, p, span) | Correct heading hierarchy, `lang` for mixed content |
| `AImage` | Lazy-loaded image | Descriptive `alt`, `loading="lazy"`, aspect ratio |
| `ABadge` | Status/count indicator | `aria-label` for count context |
| `AInput` | Form input | `aria-describedby`, `aria-invalid`, associated `<label>` |
| `ALink` | Anchor/NuxtLink | Descriptive text, `aria-current` for active |
| `ASpinner` | Loading indicator | `role="status"`, `aria-label="Loading"` |
| `ADivider` | Visual separator | `role="separator"`, `aria-orientation` |
| `AAvatar` | User image | `alt` with user name, fallback initials |
| `AChip` | Tag/filter | `role="option"` in lists, removable with `aria-label` |
| `ASwitch` | Toggle | `role="switch"`, `aria-checked` |

---

## Molecules

**Composed atoms with local coordination. One concern, one responsibility.**

### Rules

- Composed exclusively from Atoms (never other Molecules or Organisms)
- Local state only: `ref()` for UI coordination (toggle, hover, focus)
- No global store access, no API calls, no route logic
- Prefix: `M` (e.g., `MSearchBar`, `MCard`)
- MUST define typed props interface and emits
- MUST maintain accessibility of composed Atoms (don't break their ARIA)
- MUST use Tailwind MD3 tokens for all color/spacing

### Molecule Checklist

```
☐ Imports ONLY from atoms/ directory
☐ State is UI-only (open, focused, selected index)
☐ No useFetch, useAsyncData, $fetch, or API modules
☐ No useStore, useState, or Pinia access
☐ No useRoute / useRouter / navigateTo
☐ Emits domain events up to parent
☐ Testable in isolation with props and event assertions
☐ Composed Atoms retain their ARIA contracts
☐ Group labeling (fieldset/legend, group role) where appropriate
☐ Error states accessible (aria-invalid, aria-errormessage)
```

### Example

```vue
<!-- components/molecules/MFormField.vue -->
<template>
  <div class="flex flex-col gap-1">
    <label
      :for="inputId"
      class="text-sm font-medium text-on-surface-variant"
    >
      {{ label }}
      <span v-if="required" class="text-error" aria-hidden="true">*</span>
      <span v-if="required" class="sr-only">(required)</span>
    </label>

    <AInput
      :id="inputId"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :aria-describedby="helpId"
      :aria-invalid="!!error || undefined"
      :aria-errormessage="error ? errorId : undefined"
      :aria-required="required || undefined"
      @update:model-value="$emit('update:modelValue', $event)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <p
      v-if="error"
      :id="errorId"
      class="text-xs text-error flex items-center gap-1"
      role="alert"
    >
      <AIcon name="alert-circle" size="xs" aria-hidden="true" />
      {{ error }}
    </p>

    <p
      v-else-if="help"
      :id="helpId"
      class="text-xs text-on-surface-variant"
    >
      {{ help }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useId } from '#imports'

const props = defineProps<{
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  error?: string
  help?: string
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const isFocused = ref(false)
const inputId = useId()
const helpId = computed(() => `${inputId}-help`)
const errorId = computed(() => `${inputId}-error`)
</script>
```

---

## Organisms

**Smart containers that orchestrate everything. The boundary between UI and business logic.**

### Rules

- May compose Atoms, Molecules, and other Organisms
- May access Pinia stores, composables, `useAsyncData`, `useFetch`
- May use route/router, lifecycle hooks, watchers
- Prefix: `O` (e.g., `OHeroSection`, `OPricingTable`)
- MUST handle error/loading/empty states
- MUST guard browser globals with `process.client`
- MUST map to ≥1 viral principle (see Viral Framework below)
- MUST use landmark roles (`<section>`, `<nav>`, `<main>`, `<aside>`) with `aria-labelledby`
- MUST announce dynamic content changes via `aria-live` regions

### Organism Checklist

```
☐ Composes Atoms and Molecules (may also compose other Organisms)
☐ Owns data fetching + error/loading/empty state handling
☐ Connects to stores or composables for domain logic
☐ SSR-safe: no unguarded browser globals
☐ Landmark role with aria-labelledby
☐ Dynamic content changes announced (aria-live)
☐ Skip links or focus management for major content updates
☐ Maps to ≥1 viral principle
☐ Tested with integration tests (mocked API, real children)
```

### Example

```vue
<!-- components/organisms/OHeroSection.vue -->
<template>
  <section
    class="relative overflow-hidden bg-surface py-24 lg:py-32"
    aria-labelledby="hero-heading"
  >
    <!-- Atmospheric background — decorative -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-primary-container/20 via-transparent to-secondary-container/30"
      aria-hidden="true"
    />
    <div
      class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/3"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-5xl px-6 text-center">
      <AText
        id="hero-heading"
        tag="h1"
        class="text-5xl md:text-7xl font-bold text-on-surface tracking-tight motion-safe:animate-fade-up"
      >
        {{ t('hero.title') }}
      </AText>

      <AText
        tag="p"
        class="mt-6 text-xl text-on-surface-variant max-w-2xl mx-auto motion-safe:animate-fade-up motion-safe:animation-delay-100"
      >
        {{ t('hero.subtitle') }}
      </AText>

      <div
        class="mt-8 motion-safe:animate-fade-up motion-safe:animation-delay-200"
        aria-live="polite"
      >
        <MSocialProof :count="activeUsers" :avatars="recentAvatars" />
      </div>

      <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center motion-safe:animate-fade-up motion-safe:animation-delay-300">
        <AButton
          variant="filled"
          :loading="isSubmitting"
          @click="handleCta"
        >
          {{ t('hero.cta') }}
        </AButton>
        <AButton variant="outlined">
          {{ t('hero.secondary') }}
        </AButton>
      </div>

      <MCountdown
        v-if="offerEnds"
        :target="offerEnds"
        class="mt-12"
        :aria-label="t('hero.countdownLabel')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConversionStore } from '~/stores/conversion'
import { useAnalytics } from '~/composables/useAnalytics'

const { t } = useI18n()
const store = useConversionStore()
const { track } = useAnalytics()

const isSubmitting = ref(false)
const activeUsers = computed(() => store.activeUserCount)
const recentAvatars = computed(() => store.recentAvatars)
const offerEnds = computed(() => store.currentOfferDeadline)

async function handleCta() {
  isSubmitting.value = true
  track('hero_cta_click')
  await navigateTo('/signup')
}
</script>
```

---

## Viral Framework Integration (UI/UX Guardrails)

Every Organism MUST map to ≥1 viral principle. Use as a design checklist.

### 1. Social Currency (Make it Shareable)

| Pattern | Component | A11y Note |
|---------|-----------|-----------|
| Inner Remarkability | `OStatsDashboard` | Live region for updating numbers |
| Game Mechanics | `OLeaderboard`, `ABadge` | `role="list"`, rank announced |
| Insider Feeling | `OExclusiveAccess` | Countdown accessible, gated content announced |

### 2. Triggers (Top of Mind)

| Pattern | Component | A11y Note |
|---------|-----------|-----------|
| Context Cues | `ONotificationBar` | `role="alert"`, dismissible with Escape |
| Habit Linking | `ODailyCheckIn` | Progress bar with `aria-valuenow` |
| Frequency | `ORecurringReminder` | Form fields fully labeled |

### 3. Emotion (High Arousal)

| Pattern | Component | A11y Note |
|---------|-----------|-----------|
| Awe | `OIncomeCalculator` | Results announced via `aria-live` |
| Excitement/Urgency | `MCountdown`, `OFlashOffer` | `role="timer"`, no seizure-inducing flash |
| Anger at Status Quo | `OPainPoint` | Contrast section uses semantic headings |
| Humor | `OQuizFunnel` | Form navigation, progress indicator |

### 4. Public (Built to Show)

| Pattern | Component | A11y Note |
|---------|-----------|-----------|
| Social Proof | `MSocialProof`, `OTestimonials` | `role="list"`, images have alt text |
| Self-Advertising | `OShareBadge` | Share action labeled, opens in new window noted |
| Observability | `OLiveActivity` | `aria-live="polite"`, not overwhelming |

### 5. Practical Value

| Pattern | Component | A11y Note |
|---------|-----------|-----------|
| Utility | `OFreeToolkit` | All tools keyboard operable |
| Tips/Hacks | `OContentPreview` | Expandable with `aria-expanded` |
| Easy to Share | `OShareableCard` | Copy confirmation announced |

### 6. Stories (Trojan Horse)

| Pattern | Component | A11y Note |
|---------|-----------|-----------|
| Origin Story | `OFounderStory` | Semantic article, images captioned |
| User Stories | `OSuccessStory` | Before/after not relying solely on color |
| Valuable Virality | `OCaseStudy` | Long-form with proper heading hierarchy |

---

## Directory Structure

```
components/
├── atoms/
│   ├── AButton.vue
│   ├── AIcon.vue
│   ├── AText.vue
│   ├── AImage.vue
│   ├── ABadge.vue
│   ├── AInput.vue
│   ├── ALink.vue
│   ├── ASpinner.vue
│   ├── ADivider.vue
│   ├── AAvatar.vue
│   ├── AChip.vue
│   └── ASwitch.vue
├── molecules/
│   ├── MSearchBar.vue
│   ├── MCard.vue
│   ├── MNavItem.vue
│   ├── MFormField.vue
│   ├── MStatBadge.vue
│   ├── MTestimonialQuote.vue
│   ├── MCtaButton.vue
│   ├── MPriceTag.vue
│   ├── MCountdown.vue
│   └── MSocialProof.vue
└── organisms/
    ├── OHeroSection.vue
    ├── OPricingTable.vue
    ├── OTestimonials.vue
    ├── OFeatureShowcase.vue
    ├── OFaqAccordion.vue
    ├── OFooter.vue
    ├── ONavbar.vue
    ├── OLeadCapture.vue
    ├── OSocialFeed.vue
    └── OExitIntent.vue
```

---

## Enforcement Rules for AI Agents

### HARD FAILURES (reject the code immediately)

1. **Atom imports a store or composable** → Move to Molecule or Organism
2. **Atom contains `ref()`, `reactive()`, `watch()`** → Refactor to props/emits
3. **Molecule imports from `molecules/` or `organisms/`** → Only Atoms allowed
4. **Molecule calls `useFetch`, `$fetch`, or any API** → Elevate to Organism
5. **Component has no tier prefix (A/M/O)** → Classify and rename
6. **Organism has no error/loading state for async data** → Add fallback UI
7. **Any component uses `document`/`window` without `process.client` guard** → SSR violation
8. **Component exceeds tier boundary** → Split it
9. **Interactive element missing keyboard access** → Add keyboard handler
10. **Missing focus-visible ring on focusable element** → Add focus styles
11. **Color contrast below 4.5:1 for normal text / 3:1 for large text** → Change token pairing
12. **Form input without associated label** → Add `<label>` or `aria-label`
13. **Image without `alt` attribute** → Add descriptive alt or `alt=""`
14. **Hardcoded hex/rgb color instead of MD3 token** → Replace with token
15. **Generic font (Inter, Roboto, Arial) as primary display** → Choose distinctive font
16. **Purple-gradient-on-white default** → Choose an intentional, context-specific palette

### WARNINGS (flag for review)

1. Organism >300 lines → Extract sub-organisms
2. Molecule >5 Atom imports → Possibly doing too much
3. Missing `prefers-reduced-motion` guard on animation → Add `motion-safe:`
4. No `aria-live` on dynamically updating content → Add live region
5. Touch target <44px → Increase size
6. Organism not mapped to viral principle → May lack conversion purpose
7. Same visual design as previous generation → Vary the aesthetic
8. No atmospheric background/texture on page sections → Add depth

### AUTO-FIX PATTERNS

| Violation | Fix |
|-----------|-----|
| Atom has `ref()` | Extract → create Molecule wrapper |
| Molecule calls API | Lift to parent Organism, pass as props |
| Missing prefix | Analyze imports/state → assign tier prefix |
| No loading state | Wrap in `<Suspense>` or conditional render |
| Missing focus ring | Add `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` |
| Hardcoded color | Map to nearest MD3 semantic token |
| Missing label | Generate `aria-label` from context or add `<label>` |

---

## Testing Strategy by Tier

| Tier | Test Type | What to Assert |
|------|-----------|----------------|
| Atom | Unit (Vitest + VTU) | Props → render, emits fire, ARIA present, keyboard works |
| Molecule | Unit (Vitest + VTU) | State transitions, child coordination, error states accessible |
| Organism | Integration (Vitest + mocked deps) | Data flow, loading/error UI, live regions announce |
| Page | E2E (Playwright) | Full journeys, axe-core audit passes, focus management |
| Color System | Unit | All token pairings meet WCAG AA contrast thresholds |

### Automated A11y Testing

```typescript
// tests/a11y.setup.ts
import { configureAxe } from 'vitest-axe'

configureAxe({
  rules: {
    'color-contrast': { enabled: true },
    'keyboard-access': { enabled: true },
    'aria-required-attr': { enabled: true },
    'label': { enabled: true },
  },
})
```

---

## Quick Reference

```
┌──────────────────────────────────────────────────────────────────┐
│  ATOM (A*)       │  Pure render. No state. Full ARIA.            │
│  MOLECULE (M*)   │  Local UI state. Atoms only. Grouped a11y.   │
│  ORGANISM (O*)   │  Full power. Landmarks. Live regions.        │
├──────────────────────────────────────────────────────────────────┤
│  COLOR           │  MD3 tonal tokens only. Never hardcode.       │
│  CONTRAST        │  4.5:1 normal / 3:1 large / 3:1 UI. Always.  │
│  KEYBOARD        │  Every interactive element. No exceptions.    │
│  FOCUS           │  Visible ring. 2px min. Offset for clarity.   │
│  MOTION          │  motion-safe: prefix. Respect user prefs.     │
│  TYPOGRAPHY      │  Distinctive. Never generic. Context-driven.  │
│  DESIGN          │  Bold direction. No AI slop. Intentional.     │
│  VIRAL           │  Every O* serves ≥1 viral pillar.             │
└──────────────────────────────────────────────────────────────────┘
```
