<script setup></script>

<script>
export default {
  name: 'HelloWorld',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    incrementCount() {
      this.count++
    },
  },
}
</script>

<template>
  <section class="mx-auto max-w-3xl text-center">
    <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
      <span class="size-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
      Full-Stack: Vue 3 (Options API) + Tailwind v4 + Express 5 + Drizzle + MySQL
    </div>

    <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
      {{ title }}
    </h1>

    <p v-if="subtitle" class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
      {{ subtitle }}
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
      <button
        type="button"
        class="inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-[0.99]"
        @click="incrementCount"
      >
        Reactive State Counter: {{ count }}
      </button>

      <a
        href="#users-section"
        class="inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Try Interactive API Demo &darr;
      </a>
    </div>
  </section>
</template>