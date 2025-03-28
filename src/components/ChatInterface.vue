<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/services/db'
import { ai, type ChatMessage } from '@/services/ai'
import ChatMessage from '@/components/ChatMessage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { SendIcon, LightningIcon } from 'lucide-vue-next'

const route = useRoute()
const chatId = ref('')
const chat = ref(null)
const messages = ref([])
const newMessage = ref('')
const loading = ref(false)
const messageContainerRef = ref(null)
const streamedResponse = ref('')

const loadChat = async () => {
  try {
    chatId.value = route.params.id as string
    chat.value = await db.getChat(chatId.value)

    if (chat.value) {
      messages.value = chat.value.messages || []
    }
  } catch (error) {
    console.error('Error loading chat:', error)
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainerRef.value) {
    messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
  }
}

const saveMessage = async (content: string, role: 'user' | 'assistant') => {
  try {
    const message = await db.createMessage({
      chatId: chatId.value,
      content,
      role,
    })
    messages.value.push(message)
    await scrollToBottom()
    return message
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || loading.value) return

  const userMessage = newMessage.value
  newMessage.value = ''
  loading.value = true
  streamedResponse.value = ''

  try {
    // Save user message
    await saveMessage(userMessage, 'user')

    // Format messages for AI
    const aiMessages: ChatMessage[] = messages.value.map((msg) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    }))

    // Stream the AI response
    await ai.streamChat(
      aiMessages,
      undefined, // use default model
      (chunk) => {
        streamedResponse.value += chunk
        scrollToBottom()
      },
    )

    // Save the complete AI response after streaming
    await saveMessage(streamedResponse.value, 'assistant')
    streamedResponse.value = ''
  } catch (error) {
    console.error('Error processing message:', error)
  } finally {
    loading.value = false
  }
}

// Watch for route changes to load the chat
watch(() => route.params.id, loadChat, { immediate: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div v-if="chat" class="flex flex-col h-full">
    <div ref="messageContainerRef" class="flex-1 overflow-y-auto border-b border-border">
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full p-4">
        <div class="text-center max-w-md space-y-2">
          <h3 class="text-xl font-medium">Start a conversation</h3>
          <p class="text-muted-foreground">
            Send a message to begin chatting with the AI assistant.
          </p>
        </div>
      </div>

      <template v-else>
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :role="message.role"
          :content="message.content"
        />
      </template>

      <!-- Streaming message preview -->
      <ChatMessage v-if="streamedResponse" role="assistant" :content="streamedResponse" />
    </div>

    <div class="p-4 bg-background">
      <div class="flex gap-2 items-end">
        <textarea
          v-model="newMessage"
          placeholder="Type your message..."
          class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none min-h-[80px]"
          rows="3"
          @keydown.enter.ctrl="sendMessage"
        ></textarea>

        <BaseButton
          @click="sendMessage"
          :disabled="loading || !newMessage.trim()"
          class="h-10 px-4"
          :class="{ 'animate-pulse': loading }"
        >
          <SendIcon v-if="!loading" class="h-4 w-4 mr-2" />
          <LightningIcon v-else class="h-4 w-4 mr-2 animate-spin" />
          {{ loading ? 'Thinking...' : 'Send' }}
        </BaseButton>
      </div>
      <p class="text-xs text-muted-foreground mt-2">Press Ctrl+Enter to send</p>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-full">
    <div class="animate-pulse">Loading chat...</div>
  </div>
</template>
