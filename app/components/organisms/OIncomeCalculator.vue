<script setup lang="ts">
const hoursPerWeek = ref(10)
const hourlyRate = ref(25)
const weeks = ref(52)

const monthlyIncome = computed(() =>
  Math.round((hoursPerWeek.value * hourlyRate.value * weeks.value) / 12)
)
const annualIncome = computed(() =>
  Math.round(hoursPerWeek.value * hourlyRate.value * weeks.value)
)

const liveRegionText = computed(
  () => `Estimated annual income: $${annualIncome.value.toLocaleString()}`
)
</script>

<template>
  <section
    id="income-calculator"
    class="py-12 px-4"
    aria-labelledby="calculator-heading"
  >
    <div class="max-w-2xl mx-auto">
      <h2
        id="calculator-heading"
        class="text-2xl font-bold text-on-surface mb-2 text-center"
      >
        {{ $t('viral.incomeCalculator') }}
      </h2>
      <p class="text-on-surface-variant text-center mb-8">
        {{ $t('calculator.subtitle') }}
      </p>

      <div class="bg-surface-container rounded-2xl p-6 space-y-6">
        <!-- Hours per week -->
        <div>
          <label
            for="hours-per-week"
            class="block text-sm font-medium text-on-surface mb-2"
          >
            {{ $t('calculator.hoursPerWeek') }}: {{ hoursPerWeek }}
          </label>
          <input
            id="hours-per-week"
            v-model.number="hoursPerWeek"
            type="range"
            min="1"
            max="40"
            step="1"
            class="w-full h-2 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
            :aria-valuemin="1"
            :aria-valuemax="40"
            :aria-valuenow="hoursPerWeek"
          />
        </div>

        <!-- Hourly rate -->
        <div>
          <label
            for="hourly-rate"
            class="block text-sm font-medium text-on-surface mb-2"
          >
            {{ $t('calculator.hourlyRate') }}: ${{ hourlyRate }}
          </label>
          <input
            id="hourly-rate"
            v-model.number="hourlyRate"
            type="range"
            min="10"
            max="200"
            step="5"
            class="w-full h-2 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary"
            :aria-valuemin="10"
            :aria-valuemax="200"
            :aria-valuenow="hourlyRate"
          />
        </div>

        <!-- Results -->
        <div
          class="bg-primary-container rounded-xl p-6 text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <p class="sr-only">{{ liveRegionText }}</p>
          <p class="text-4xl font-bold text-on-primary-container motion-safe:transition-all motion-safe:duration-300">
            ${{ annualIncome.toLocaleString() }}
          </p>
          <p class="text-on-primary-container/70 mt-1">{{ $t('calculator.perYear') }}</p>
          <p class="text-lg font-semibold text-on-primary-container mt-2">
            ${{ monthlyIncome.toLocaleString() }} / {{ $t('calculator.month') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
