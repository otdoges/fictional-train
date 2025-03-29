<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/services/db'
import ChatList from '@/components/ChatList.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { PlusIcon } from 'lucide-vue-next'
import { useMotion } from '@vueuse/motion'

const router = useRouter()
const chats = ref([])
const isLoading = ref(true)
const newChatName = ref('')
const isCreating = ref(false)

// Load all chats
const loadChats = async () => {
  isLoading.value = true
  try {
    chats.value = await db.getAllChats()
  } catch (error) {
    console.error('Error loading chats:', error)
  } finally {
    isLoading.value = false
  }
}

// Create a new chat
const createChat = async () => {
  if (!newChatName.value.trim() && !isCreating.value) {
    // Create with default name if empty
    newChatName.value = `New Chat ${new Date().toLocaleString()}`
  }

  isCreating.value = true
  try {
    const chat = await db.createChat(newChatName.value.trim())
    newChatName.value = ''
    await loadChats()
    // Navigate to the new chat
    router.push(`/chat/${chat.id}`)
  } catch (error) {
    console.error('Error creating chat:', error)
  } finally {
    isCreating.value = false
  }
}

// Initialize
onMounted(() => {
  loadChats()
})
</script>

<template>
  <div class="container py-8 px-4 mx-auto max-w-6xl">
    <use-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">Your Conversations</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Chat with advanced AI models including Google Gemini and Azure AI.
      </p>
    </div>
    </use-motion>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
      <!-- Chat list section -->
      <div class="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Your Chats</h2>
        </div>

        <div class="mb-4">
          <div class="flex gap-2">
            <input
              v-model="newChatName"
              placeholder="New chat name..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              @keyup.enter="createChat"
            />
            <BaseButton @click="createChat" :disabled="isCreating">
              <PlusIcon class="h-4 w-4" />
            </BaseButton>
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-pulse text-muted-foreground">Loading chats...</div>
        </div>

        <div v-else>
          <ChatList :chats="chats" @refresh="loadChats" />

          <div v-if="chats.length === 0" class="text-center py-8 text-muted-foreground">
            <p>No chats yet. Create one to get started!</p>
          </div>
        </div>
      </div>

      <!-- Welcome section -->
      <div
        class="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center shadow-sm"
      >
        <use-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 200 } }">
          <div class="max-w-md text-center">
            <div class="flex justify-center mb-6">
              <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-4xl">🤖</span>
              </div>
            </div>

            <h2 class="text-2xl font-bold mb-4">Welcome to AI Chat</h2>
            <p class="text-muted-foreground mb-6">
              Create a new conversation or select an existing one to start chatting with AI
              assistants powered by the latest language models.
            </p>

            <BaseButton size="lg" @click="createChat" class="w-full">
              <PlusIcon class="h-5 w-5 mr-2" />
              Start New Conversation
            </BaseButton>
          </div>
        </use-motion>
      </div>
    </div>
  </div>
</template>
