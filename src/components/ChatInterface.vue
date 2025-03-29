<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/services/db'
import { ai, type ChatMessage as AIChatMessage, models } from '@/services/ai'
import ChatMessageComponent from '@/components/ChatMessage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { SendIcon } from 'lucide-vue-next'
import { LockIcon, ZapIcon, ChevronDownIcon, CheckIcon } from 'lucide-vue-next'

// Define chat interface to match Prisma model
interface Chat {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

interface Message {
  id: string
  content: string
  role: string
  createdAt: Date
  chatId: string
}

const route = useRoute()
const chatId = ref('')
const chat = ref<Chat | null>(null)
const messages = ref<Message[]>([])
const newMessage = ref('')
const loading = ref(false)
const messageContainerRef = ref<HTMLDivElement | null>(null)
const streamedResponse = ref('')
const useAzureModel = ref(false)
const showModelDropdown = ref(false)
const selectedModel = ref(models.gemini)

// Available models for selection
const availableModels = [
  { name: 'Gemini 2.5 Pro', value: models.gemini, provider: 'OpenRouter' },
  { name: 'GPT-4o', value: models.gpt4, provider: 'OpenRouter' },
  { name: 'Azure AI', value: models.azure, provider: 'Azure', useAzure: true },
]

const loadChat = async () => {
  try {
    chatId.value = route.params.id as string
    const chatData = await db.getChat(chatId.value)

    if (chatData) {
      chat.value = chatData as Chat
      messages.value = chatData.messages || []
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
    messages.value.push(message as Message)
    await scrollToBottom()
    return message
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

const selectModel = (model: (typeof availableModels)[0]) => {
  selectedModel.value = model.value
  useAzureModel.value = !!model.useAzure
  showModelDropdown.value = false
}

const toggleModelDropdown = () => {
  showModelDropdown.value = !showModelDropdown.value
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
    const aiMessages: AIChatMessage[] = messages.value.map((msg) => ({
      role:
        msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system'
          ? (msg.role as 'user' | 'assistant' | 'system')
          : 'user',
      content: msg.content,
    }))

    // Stream the AI response
    await ai.streamChat(
      aiMessages,
      useAzureModel.value,
      selectedModel.value, // use selected model
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
        <ChatMessageComponent
          v-for="message in messages"
          :key="message.id"
          :role="message.role === 'user' ? 'user' : 'assistant'"
          :content="message.content"
        />
      </template>

      <!-- Streaming message preview -->
      <ChatMessageComponent v-if="streamedResponse" role="assistant" :content="streamedResponse" />
    </div>

    <div class="p-4 bg-background">
      <!-- Model selector dropdown -->
      <div class="flex justify-end mb-2 relative">
        <button
          @click="toggleModelDropdown"
          class="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors border border-input px-2 py-1 rounded"
        >
          <LockIcon v-if="useAzureModel" class="h-3 w-3 mr-1" />
          <ZapIcon v-else class="h-3 w-3 mr-1" />
          {{ useAzureModel ? 'Azure AI' : selectedModel === models.gemini ? 'Gemini' : 'GPT-4o' }}
          <ChevronDownIcon class="h-3 w-3 ml-1" />
        </button>

        <!-- Dropdown content -->
        <div
          v-if="showModelDropdown"
          class="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-md shadow-md z-10"
        >
          <div class="p-1 text-sm">
            <button
              v-for="model in availableModels"
              :key="model.value"
              @click="selectModel(model)"
              class="flex items-center justify-between w-full px-2 py-1.5 rounded hover:bg-muted"
            >
              <span class="flex items-center">
                <ZapIcon v-if="!model.useAzure" class="h-3 w-3 mr-1.5" />
                <LockIcon v-else class="h-3 w-3 mr-1.5" />
                {{ model.name }}
              </span>
              <span class="text-xs text-muted-foreground">{{ model.provider }}</span>
              <CheckIcon v-if="selectedModel === model.value" class="h-3 w-3 ml-2" />
            </button>
          </div>
        </div>
      </div>

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
          :class="loading ? 'animate-pulse' : ''"
        >
          <SendIcon v-if="!loading" class="h-4 w-4 mr-2" />
          <ZapIcon v-else class="h-4 w-4 mr-2 animate-spin" />
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
