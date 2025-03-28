<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/services/db'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useRouter } from 'vue-router'
import { PlusCircleIcon, TrashIcon } from 'lucide-vue-next'

const chats = ref([])
const newChatName = ref('')
const chatListRef = ref(null)
const router = useRouter()

const loadChats = async () => {
  try {
    chats.value = await db.getChats()
  } catch (error) {
    console.error('Error loading chats:', error)
  }
}

const createChat = async () => {
  if (!newChatName.value.trim()) return

  try {
    const chat = await db.createChat({
      name: newChatName.value.trim(),
    })
    newChatName.value = ''
    router.push(`/chat/${chat.id}`)
  } catch (error) {
    console.error('Error creating chat:', error)
  }
}

const deleteChat = async (id: string) => {
  try {
    await db.deleteChat(id)
    await loadChats()
  } catch (error) {
    console.error('Error deleting chat:', error)
  }
}

const navigateToChat = (id: string) => {
  router.push(`/chat/${id}`)
}

onMounted(() => {
  loadChats()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="text-xl font-semibold mb-4">Your Chats</h2>

    <div class="flex gap-2 mb-6">
      <input
        v-model="newChatName"
        type="text"
        placeholder="New chat name..."
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @keyup.enter="createChat"
      />
      <BaseButton @click="createChat" size="icon">
        <PlusCircleIcon class="h-5 w-5" />
      </BaseButton>
    </div>

    <div ref="chatListRef" class="space-y-2 overflow-y-auto">
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="flex items-center justify-between p-3 rounded-md bg-card hover:bg-accent/30 transition-colors cursor-pointer"
        @click="navigateToChat(chat.id)"
      >
        <div>
          <h3 class="font-medium">{{ chat.name }}</h3>
          <p class="text-xs text-muted-foreground">
            {{ new Date(chat.updatedAt).toLocaleString() }}
          </p>
        </div>
        <BaseButton variant="ghost" size="icon" class="h-8 w-8" @click.stop="deleteChat(chat.id)">
          <TrashIcon class="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </BaseButton>
      </div>

      <div v-if="chats.length === 0" class="text-center py-8 text-muted-foreground">
        No chats yet. Create one to get started!
      </div>
    </div>
  </div>
</template>
