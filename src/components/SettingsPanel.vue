<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/services/db'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { PlusIcon, TrashIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next'

const { toast } = useToast()

const apiKeys = ref([])
const newApiKey = ref({
  name: '',
  key: '',
  provider: 'openrouter',
})
const showKey = ref(false)
const isLoading = ref(false)

// Load API keys
const loadApiKeys = async () => {
  try {
    apiKeys.value = await db.getApiKeys()
  } catch (error) {
    console.error('Error loading API keys:', error)
    toast({
      title: 'Error',
      description: 'Failed to load API keys',
      variant: 'destructive',
    })
  }
}

// Add new API key
const addApiKey = async () => {
  if (!newApiKey.value.name || !newApiKey.value.key) {
    toast({
      title: 'Error',
      description: 'Please fill in all fields',
      variant: 'destructive',
    })
    return
  }

  isLoading.value = true
  try {
    await db.createApiKey(newApiKey.value)
    newApiKey.value = { name: '', key: '', provider: 'openrouter' }
    await loadApiKeys()
    toast({
      title: 'Success',
      description: 'API key added successfully',
    })
  } catch (error) {
    console.error('Error adding API key:', error)
    toast({
      title: 'Error',
      description: 'Failed to add API key',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

// Delete API key
const deleteApiKey = async (id: string) => {
  try {
    await db.deleteApiKey(id)
    await loadApiKeys()
    toast({
      title: 'Success',
      description: 'API key deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting API key:', error)
    toast({
      title: 'Error',
      description: 'Failed to delete API key',
      variant: 'destructive',
    })
  }
}

// Initialize
onMounted(() => {
  loadApiKeys()
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">API Keys</h2>
      <p class="text-muted-foreground">Manage your API keys for different AI providers</p>
    </div>

    <!-- Add new API key -->
    <div class="space-y-4">
      <div class="grid gap-4 md:grid-cols-3">
        <div class="space-y-2">
          <label class="text-sm font-medium">Name</label>
          <input
            v-model="newApiKey.name"
            type="text"
            placeholder="My OpenRouter Key"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Provider</label>
          <select
            v-model="newApiKey.provider"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="openrouter">OpenRouter</option>
            <option value="azure">Azure AI</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">API Key</label>
          <div class="relative">
            <input
              v-model="newApiKey.key"
              :type="showKey ? 'text' : 'password'"
              placeholder="sk-..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showKey = !showKey"
            >
              <EyeIcon v-if="showKey" class="h-4 w-4" />
              <EyeOffIcon v-else class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <BaseButton @click="addApiKey" :disabled="isLoading">
        <PlusIcon class="h-4 w-4 mr-2" />
        Add API Key
      </BaseButton>
    </div>

    <!-- API Keys list -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Your API Keys</h3>
      <div class="grid gap-4">
        <div
          v-for="key in apiKeys"
          :key="key.id"
          class="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div class="space-y-1">
            <p class="font-medium">{{ key.name }}</p>
            <p class="text-sm text-muted-foreground">{{ key.provider }}</p>
          </div>
          <BaseButton
            variant="ghost"
            size="sm"
            @click="deleteApiKey(key.id)"
            class="text-destructive hover:text-destructive"
          >
            <TrashIcon class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
