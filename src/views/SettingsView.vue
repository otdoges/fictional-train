<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/services/db'
import SettingsPanel from '@/components/SettingsPanel.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useMotion } from '@vueuse/motion'

const { toast } = useToast()

const settings = ref({
  theme: 'system',
  defaultModel: 'gemini',
})

// Load settings
const loadSettings = async () => {
  try {
    const userSettings = await db.getSettings()
    if (userSettings) {
      settings.value = userSettings
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    toast({
      title: 'Error',
      description: 'Failed to load settings',
      variant: 'destructive',
    })
  }
}

// Update settings
const updateSettings = async () => {
  try {
    await db.updateSettings(settings.value)
    toast({
      title: 'Success',
      description: 'Settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    toast({
      title: 'Error',
      description: 'Failed to update settings',
      variant: 'destructive',
    })
  }
}

// Initialize
onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="container py-8 px-4 mx-auto max-w-6xl">
    <use-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Settings</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your API keys and preferences
        </p>
      </div>
    </use-motion>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
      <!-- Navigation -->
      <div class="bg-card border border-border rounded-xl p-4 shadow-sm">
        <nav class="space-y-1">
          <a
            href="#api-keys"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground bg-accent"
          >
            API Keys
          </a>
          <a
            href="#preferences"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            Preferences
          </a>
        </nav>
      </div>

      <!-- Content -->
      <div class="space-y-8">
        <!-- API Keys Section -->
        <section id="api-keys">
          <SettingsPanel />
        </section>

        <!-- Preferences Section -->
        <section id="preferences" class="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 class="text-2xl font-bold mb-6">Preferences</h2>

          <div class="space-y-6">
            <!-- Theme -->
            <div class="space-y-2">
              <label class="text-sm font-medium">Theme</label>
              <select
                v-model="settings.theme"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <!-- Default Model -->
            <div class="space-y-2">
              <label class="text-sm font-medium">Default AI Model</label>
              <select
                v-model="settings.defaultModel"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="gemini">Gemini 2.5 Pro</option>
                <option value="gpt4">GPT-4</option>
                <option value="azure">Azure AI</option>
              </select>
            </div>

            <button
              @click="updateSettings"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
