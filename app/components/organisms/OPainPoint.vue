<script setup lang="ts">
interface PainPoint {
  id: string
  problem: string
  solution: string
}

const painPoints: PainPoint[] = [
  { id: '1', problem: 'Trading time for money with no ceiling', solution: 'Scalable income streams that grow while you sleep' },
  { id: '2', problem: 'No idea where to start making money online', solution: 'Curated, vetted resources organized by category and difficulty' },
  { id: '3', problem: 'Wasting time on scams and low-quality content', solution: 'Expert-reviewed opportunities with real success stories' },
]
</script>

<template>
  <section
    class="py-12 px-4"
    aria-labelledby="pain-points-heading"
  >
    <div class="max-w-4xl mx-auto">
      <h2
        id="pain-points-heading"
        class="text-2xl font-bold text-on-surface mb-8 text-center"
      >
        {{ $t('painPoints.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="point in painPoints"
          :key="point.id"
          class="bg-surface-container rounded-2xl p-6"
        >
          <!-- Problem -->
          <div class="mb-4">
            <span
              class="inline-flex items-center gap-1 text-error text-sm font-medium mb-2"
              aria-hidden="true"
            >
              <AIcon name="close" />
              {{ $t('painPoints.before') }}
            </span>
            <p class="text-on-surface">{{ point.problem }}</p>
          </div>

          <ADivider />

          <!-- Solution -->
          <div class="mt-4">
            <span
              class="inline-flex items-center gap-1 text-primary text-sm font-medium mb-2"
              aria-hidden="true"
            >
              <AIcon name="check" />
              {{ $t('painPoints.after') }}
            </span>
            <p class="text-on-surface">{{ point.solution }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
