<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInterface from '@/components/ChatInterface.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { ChevronLeftIcon } from 'lucide-vue-next'
import { db } from '@/services/db'

const route = useRoute()
const router = useRouter()
const chatId = ref('')
const chatName = ref('')

const loadChatInfo = async () => {
  try {
    chatId.value = route.params.id as string
    const chat = await db.getChat(chatId.value)

    if (chat) {
      chatName.value = chat.name
    }
  } catch (error) {
    console.error('Error loading chat info:', error)
    router.push('/')
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  loadChatInfo()
})
</script>

<template>
  <div class="container mx-auto py-6 h-[calc(100vh-60px)]">
    <div
      class="max-w-4xl mx-auto bg-card rounded-lg shadow-md border border-border overflow-hidden h-[calc(100vh-160px)]"
    >
      <div class="flex items-center gap-2 p-4 border-b border-border">
        <BaseButton variant="ghost" size="icon" @click="goBack">
          <ChevronLeftIcon class="h-5 w-5" />
        </BaseButton>
        <h1 class="text-lg font-medium">{{ chatName }}</h1>
      </div>

      <div class="h-[calc(100%-64px)]">
        <ChatInterface />
      </div>
    </div>
  </div>
</template>
