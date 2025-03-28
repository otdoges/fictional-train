<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  isLoading.value = true

  try {
    const success = await auth.login(username.value, password.value)

    if (success) {
      router.push('/')
    } else {
      error.value = 'Invalid username or password'
    }
  } catch (e) {
    error.value = 'An error occurred during login'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

// Login as demo user (for demo purposes)
const loginAsDemo = async () => {
  username.value = 'demo'
  password.value = 'password'
  await handleLogin()
}

// Skip login if auth is disabled
if (!auth.isAuthEnabled()) {
  auth.login('guest', 'guest')
  router.push('/')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
      <div class="text-center">
        <h1 class="text-2xl font-bold">Login to AI Chat</h1>
        <p class="mt-2 text-sm text-muted-foreground">Sign in to access your AI chat assistant</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-foreground">Username</label>
            <input
              id="username"
              v-model="username"
              name="username"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div v-if="error" class="text-destructive text-sm p-2 bg-destructive/10 rounded-md">
          {{ error }}
        </div>

        <div>
          <BaseButton type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </BaseButton>
        </div>

        <div class="text-center">
          <button type="button" @click="loginAsDemo" class="text-sm text-primary hover:underline">
            Use demo account
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
