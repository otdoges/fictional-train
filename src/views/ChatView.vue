<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChatInterface from '@/components/ChatInterface.vue'
import { db } from '@/services/db'
import { useMotion } from '@vueuse/motion'

const chatExists = ref(true)
const isLoading = ref(true)
const router = useRouter()
const route = useRoute()

onBeforeMount(async () => {
  const chatId = route.params.id as string
  try {
    isLoading.value = true
    const chat = await db.getChat(chatId)

    if (!chat) {
      chatExists.value = false
      router.push('/')
    }
  } catch (error) {
    console.error('Error checking chat existence:', error)
    chatExists.value = false
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-4rem)]">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="animate-pulse">Loading chat...</div>
    </div>

    <use-motion v-else-if="chatExists">
      <ChatInterface class="flex-1" />
    </use-motion>

    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-center p-6">
        <h2 class="text-xl font-bold mb-2">Chat not found</h2>
        <p class="text-muted-foreground mb-4">
          The chat you're looking for doesn't exist or has been deleted.
        </p>
        <router-link to="/" class="text-primary hover:underline">Return to home</router-link>
      </div>
    </div>
  </div>
</template>
