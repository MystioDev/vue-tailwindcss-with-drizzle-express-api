<script setup>
import HelloWorld from './components/HelloWorld.vue'
import UserManager from './components/UserManager.vue'

const features = [
  {
    title: 'Shared Root .env',
    description: 'A single unified environment configuration drives Vite, Express API, Drizzle ORM, and Docker Compose without duplicate files.',
    badge: 'Zero-Duplication Config',
  },
  {
    title: 'Bidirectional Port Pairing',
    description: 'Frontend Vite proxy routes to Express BACKEND_PORT, while Express CORS automatically authorizes FRONTEND_PORT.',
    badge: 'Seamless Dev Proxy & CORS',
  },
  {
    title: 'Drizzle ORM & MySQL',
    description: 'Type-safe SQL schema, automatic migrations, connection pooling with mysql2, and Drizzle Studio support out of the box.',
    badge: 'Drizzle v0.45+',
  },
  {
    title: 'Vue 3 + Tailwind CSS v4',
    description: 'Composition API (<script setup>) paired with zero-config CSS-first styling powered by @tailwindcss/vite.',
    badge: 'Modern UI Stack',
  },
  {
    title: 'Express 5 REST API',
    description: 'Modern Express 5 routing, automated JSON parsing, error handling, and ready-to-use CRUD endpoints for resources.',
    badge: 'Express v5',
  },
  {
    title: 'Optional Docker Compose',
    description: 'Spin up the entire stack (MySQL, Express API, and Nginx Vue SPA) or just the database with a single command.',
    badge: 'Docker Ready',
  },
]
</script>

<template>
  <div class="flex min-h-dvh flex-col justify-between px-6 py-10 sm:px-8 lg:px-12">
    <!-- Navigation Header -->
    <header class="mx-auto flex w-full max-w-6xl items-center justify-between">
      <div class="flex items-center gap-3 font-semibold tracking-tight text-slate-900 dark:text-white">
        <span class="inline-flex size-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-emerald-400 shadow-sm dark:bg-slate-800">
          FS
        </span>
        <div class="flex flex-col">
          <span class="text-sm font-bold sm:text-base">Vue + Express + Drizzle</span>
          <span class="font-mono text-[10px] text-slate-400">Full-Stack Starter</span>
        </div>
      </div>
      <nav aria-label="Documentation links" class="flex flex-wrap items-center gap-3 text-xs font-medium sm:gap-5 sm:text-sm text-slate-600 dark:text-slate-400">
        <a
          href="https://vuejs.org"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          Vue
        </a>
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-sky-500 dark:hover:text-sky-400"
        >
          Tailwind
        </a>
        <a
          href="https://expressjs.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-amber-500 dark:hover:text-amber-400"
        >
          Express
        </a>
        <a
          href="https://orm.drizzle.team"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-emerald-500 dark:hover:text-emerald-400"
        >
          Drizzle ORM
        </a>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="mx-auto my-12 w-full max-w-6xl space-y-16">
      <!-- Hero Section -->
      <HelloWorld
        title="Full-Stack Web Starter Template"
        subtitle="A unified starter repository combining Vue 3 and Tailwind CSS v4 on the frontend with Express 5, Drizzle ORM, and MySQL on the backend."
      />

      <!-- Interactive CRUD Demo Section -->
      <UserManager />

      <!-- Feature Grid -->
      <section>
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Architected for Rapid Full-Stack Development
          </h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Carefully tuned for developer experience, shared configuration, and containerized deployment.
          </p>
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="feature in features"
            :key="feature.title"
            class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:border-emerald-500/40 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <span class="inline-block rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {{ feature.badge }}
            </span>
            <h3 class="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {{ feature.description }}
            </p>
          </article>
        </div>
      </section>

      <!-- Quick Command Cheat Sheet -->
      <section class="rounded-3xl border border-slate-200/80 bg-slate-900 p-6 text-slate-200 shadow-md sm:p-8 dark:border-slate-800">
        <h3 class="text-lg font-bold text-white">
          Developer Quick Commands
        </h3>
        <p class="mt-1 text-xs text-slate-400">
          Run these from the project root:
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
          <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60">
            <span class="text-emerald-400 font-semibold">npm run dev</span>
            <p class="mt-1 text-slate-400">Starts both Express API and Vite frontend concurrently</p>
          </div>
          <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60">
            <span class="text-sky-400 font-semibold">npm run db:push</span>
            <p class="mt-1 text-slate-400">Synchronizes Drizzle schema directly to MySQL database</p>
          </div>
          <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60">
            <span class="text-amber-400 font-semibold">npm run db:studio</span>
            <p class="mt-1 text-slate-400">Launches Drizzle Studio visual web database GUI</p>
          </div>
          <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60">
            <span class="text-purple-400 font-semibold">npm run docker:db</span>
            <p class="mt-1 text-slate-400">Starts MySQL database container in background</p>
          </div>
          <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60">
            <span class="text-rose-400 font-semibold">npm run docker:up</span>
            <p class="mt-1 text-slate-400">Builds & runs entire stack (MySQL + API + Web) containerized</p>
          </div>
          <div class="rounded-xl bg-slate-800/80 p-3.5 border border-slate-700/60">
            <span class="text-teal-400 font-semibold">npm run build</span>
            <p class="mt-1 text-slate-400">Produces optimized production build of the Vue frontend</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="mx-auto w-full max-w-6xl border-t border-slate-200/80 pt-6 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
      <p>Full-Stack Starter Template &bull; Vue 3, Tailwind CSS v4, Express 5, Drizzle ORM &amp; MySQL. Customize freely.</p>
    </footer>
  </div>
</template>

