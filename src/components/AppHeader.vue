<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import { LogOutIcon, UserIcon, MoonIcon, SunIcon } from 'lucide-vue-next'

const router = useRouter()
const user = computed(() => auth.getCurrentUser())
const isDarkMode = computed(() => document.documentElement.classList.contains('dark'))

const logout = async () => {
  await auth.logout()
  router.push('/login')
}

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <header class="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
    <div class="flex items-center">
      <h1 class="text-xl font-bold">AI Chat Assistant</h1>
    </div>

    <div class="flex items-center space-x-4">
      <!-- Theme toggle -->
      <button
        @click="toggleDarkMode"
        class="p-2 text-muted-foreground hover:text-foreground transition-colors"
        title="Toggle dark mode"
      >
        <MoonIcon v-if="!isDarkMode" class="h-5 w-5" />
        <SunIcon v-else class="h-5 w-5" />
      </button>

      <!-- User info -->
      <div class="flex items-center space-x-2">
        <div
          class="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground"
        >
          <UserIcon class="h-4 w-4" />
        </div>
        <span class="text-sm font-medium hidden sm:inline-block">{{ user?.username }}</span>
      </div>

      <!-- Logout button -->
      <BaseButton variant="ghost" size="sm" @click="logout" title="Logout">
        <LogOutIcon class="h-4 w-4" />
        <span class="ml-2 hidden sm:inline">Logout</span>
      </BaseButton>
    </div>
  </header>
</template>
