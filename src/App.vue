<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { auth } from '@/services/auth'

// Check if user is authenticated
const isAuthenticated = computed(() => auth.isAuthenticated())

// Error handling
const error = ref('')
const showError = ref(false)

// Global error handler
window.addEventListener('error', (event) => {
  error.value = event.message || 'An unexpected error occurred'
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 5000)
})

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  error.value = event.reason?.message || 'An unexpected error occurred'
  showError.value = true
  setTimeout(() => {
    showError.value = false
  }, 5000)
})

// Detect and set dark mode
onMounted(() => {
  // Check for system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  // Apply dark mode if preferred
  if (prefersDark) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Show header only when authenticated -->
    <AppHeader v-if="isAuthenticated" />

    <!-- Error toast notification -->
    <div
      v-if="showError"
      class="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-md shadow-lg max-w-md"
    >
      <div class="flex items-start">
        <div class="flex-1">
          <p class="font-medium">Error</p>
          <p class="text-sm">{{ error }}</p>
        </div>
        <button @click="showError = false" class="ml-4 text-sm">×</button>
      </div>
    </div>

    <!-- Main content area -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Base styles */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 768px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
