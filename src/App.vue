<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { auth } from '@/services/auth'

// Check if user is authenticated
const isAuthenticated = computed(() => auth.isAuthenticated())

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
  <div class="min-h-screen bg-background text-foreground antialiased">
    <!-- Show header only when authenticated -->
    <AppHeader v-if="isAuthenticated" />

    <!-- Main content area -->
    <main :class="{ 'pt-0': !isAuthenticated }">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Remove default margins/padding */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  height: 100%;
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
