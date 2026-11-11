<script setup></script>

<script>
export default {
  name: 'UserManager',
  data() {
    return {
      backendPort: import.meta.env.BACKEND_PORT || 3000,
      frontendPort: import.meta.env.FRONTEND_PORT || 5173,
      apiStatus: 'checking', // 'online' | 'offline' | 'checking'
      apiHealth: null,
      users: [],
      loading: false,
      errorMessage: '',
      successMessage: '',
      newUser: {
        name: '',
        email: '',
      },
      editingUser: null,
    }
  },
  computed: {
    userCount() {
      return this.users.length
    },
    isFormValid() {
      return Boolean(this.newUser.email && this.newUser.email.trim())
    },
    isOnline() {
      return this.apiStatus === 'online'
    },
  },
  mounted() {
    this.checkHealth()
  },
  methods: {
    async checkHealth() {
      try {
        const res = await fetch('/api/health')
        if (res.ok) {
          this.apiHealth = await res.json()
          this.apiStatus = 'online'
          this.fetchUsers()
        } else {
          this.apiStatus = 'offline'
        }
      } catch (err) {
        this.apiStatus = 'offline'
        console.error('Health check failed:', err)
      }
    },
    async fetchUsers() {
      this.loading = true
      this.errorMessage = ''
      try {
        const res = await fetch('/api/users')
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `HTTP error ${res.status}`)
        }
        this.users = await res.json()
      } catch (err) {
        this.errorMessage = `Unable to fetch users: ${err.message}. If MySQL is not running, run 'npm run docker:db' or start your MySQL instance and run 'npm run db:push'.`
      } finally {
        this.loading = false
      }
    },
    async createUser() {
      if (!this.isFormValid) return
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newUser),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create user')
        }

        this.successMessage = 'User created successfully!'
        this.newUser = { name: '', email: '' }
        await this.fetchUsers()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    startEdit(user) {
      this.editingUser = { ...user }
    },
    cancelEdit() {
      this.editingUser = null
    },
    async updateUser() {
      if (!this.editingUser) return
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const res = await fetch(`/api/users/${this.editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.editingUser.name,
            email: this.editingUser.email,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update user')
        }

        this.successMessage = 'User updated successfully!'
        this.editingUser = null
        await this.fetchUsers()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
    async deleteUser(id) {
      if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this user?')) return
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to delete user')
        }

        this.successMessage = 'User deleted successfully!'
        await this.fetchUsers()
      } catch (err) {
        this.errorMessage = err.message
      }
    },
  },
}
</script>

<template>
  <div id="users-section" class="w-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/90">
    <!-- Header / Stack Diagnostic Bar -->
    <div class="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Full-Stack Integration Live Demo
          </h2>
          <span
            :class="[
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              apiStatus === 'online'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : apiStatus === 'offline'
                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
            ]"
          >
            <span
              :class="[
                'size-2 rounded-full',
                apiStatus === 'online'
                  ? 'bg-emerald-500 animate-pulse'
                  : apiStatus === 'offline'
                  ? 'bg-rose-500'
                  : 'bg-amber-500 animate-bounce',
              ]"
            ></span>
            API {{ apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking...' }}
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Vue frontend (Options API) talking to Express API and Drizzle ORM over synchronized ports.
        </p>
      </div>

      <!-- Port Badges -->
      <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
        <div class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span class="text-slate-400">Frontend Port:</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ frontendPort }}</span>
        </div>
        <div class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span class="text-slate-400">Backend Port:</span>
          <span class="font-bold text-sky-600 dark:text-sky-400">{{ backendPort }}</span>
        </div>
        <button
          type="button"
          class="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
          title="Refresh API status"
          @click="checkHealth"
        >
          &#x21bb; Refresh
        </button>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="successMessage" class="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-800 dark:text-emerald-300">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-sm text-rose-800 dark:text-rose-300">
      {{ errorMessage }}
    </div>

    <div v-if="apiStatus === 'offline'" class="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
      <p class="font-semibold">Backend server is not reachable on port {{ backendPort }}.</p>
      <p class="mt-1">
        Start the backend with <code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">npm run dev:backend</code> (or start everything with <code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">npm run docker:up</code>), and verify your <code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">BACKEND_PORT</code> in <code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">.env</code>.
      </p>
    </div>

    <!-- Content Grid -->
    <div class="mt-8 grid gap-8 lg:grid-cols-5">
      <!-- Create User Form (2 cols) -->
      <div class="lg:col-span-2">
        <div class="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 dark:border-slate-800/80 dark:bg-slate-800/40">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">
            Create User via Drizzle ORM
          </h3>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sends <code class="font-mono text-emerald-600 dark:text-emerald-400">POST /api/users</code> to the Express API.
          </p>

          <form class="mt-4 space-y-4" @submit.prevent="createUser">
            <div>
              <label for="name" class="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                v-model="newUser.name"
                type="text"
                placeholder="Jane Doe"
                class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label for="email" class="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Email Address <span class="text-rose-500">*</span>
              </label>
              <input
                id="email"
                v-model="newUser.email"
                type="email"
                required
                placeholder="jane@example.com"
                class="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add User to MySQL
            </button>
          </form>
        </div>
      </div>

      <!-- Users List (3 cols) -->
      <div class="lg:col-span-3">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white">
            MySQL Users ({{ userCount }})
          </h3>
          <button
            type="button"
            class="text-xs font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            @click="fetchUsers"
          >
            Reload List
          </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading && userCount === 0" class="mt-4 space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="userCount === 0"
          class="mt-4 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800"
        >
          <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            &#x1F464;
          </div>
          <p class="mt-3 text-sm font-medium text-slate-900 dark:text-white">No users found</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add a new user using the form on the left, or run database migrations.
          </p>
        </div>

        <!-- Users Cards -->
        <div v-else class="mt-4 space-y-3">
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
          >
            <!-- User Info (or Edit Mode) -->
            <div v-if="editingUser && editingUser.id === user.id" class="flex-1 space-y-2 pr-4">
              <input
                v-model="editingUser.name"
                type="text"
                class="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Name"
              />
              <input
                v-model="editingUser.email"
                type="email"
                class="w-full rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Email"
              />
              <div class="flex gap-2 pt-1">
                <button
                  type="button"
                  class="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
                  @click="updateUser"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="rounded bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                  @click="cancelEdit"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div v-else class="flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
              </span>
              <div>
                <p class="font-semibold text-slate-900 dark:text-white">
                  {{ user.name || 'Unnamed User' }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ user.email }} &bull; <span class="font-mono text-slate-400">ID: {{ user.id }}</span>
                </p>
              </div>
            </div>

            <!-- Actions (when not editing) -->
            <div v-if="!editingUser || editingUser.id !== user.id" class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                @click="startEdit(user)"
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                @click="deleteUser(user.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
