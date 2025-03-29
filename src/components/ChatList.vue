<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/services/db'
import { MoreVerticalIcon, TrashIcon, PencilIcon, CheckIcon, XIcon } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  chats: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['refresh'])

const router = useRouter()
const editingChatId = ref(null)
const editChatName = ref('')
const menuOpenChatId = ref(null)

// Navigate to a chat
const goToChat = (id) => {
  router.push(`/chat/${id}`)
}

// Open edit mode for a chat
const startEditChat = (chat) => {
  editingChatId.value = chat.id
  editChatName.value = chat.name
  menuOpenChatId.value = null
}

// Cancel editing
const cancelEdit = () => {
  editingChatId.value = null
  editChatName.value = ''
}

// Save edited chat name
const saveEditedChat = async () => {
  if (!editChatName.value.trim()) return

  try {
    await db.updateChat(editingChatId.value, {
      name: editChatName.value.trim(),
    })
    emit('refresh')
  } catch (error) {
    console.error('Error updating chat:', error)
  } finally {
    editingChatId.value = null
    editChatName.value = ''
  }
}

// Delete a chat
const deleteChat = async (id) => {
  try {
    await db.deleteChat(id)
    emit('refresh')
  } catch (error) {
    console.error('Error deleting chat:', error)
  }
}

// Toggle chat menu
const toggleMenu = (chatId) => {
  menuOpenChatId.value = menuOpenChatId.value === chatId ? null : chatId
}
</script>

<template>
  <div class="space-y-1.5">
    <div v-for="chat in props.chats" :key="chat.id" class="group relative">
      <!-- Editing mode -->
      <div
        v-if="editingChatId === chat.id"
        class="flex items-center w-full gap-1 p-2 rounded-md border border-input"
      >
        <input
          v-model="editChatName"
          class="flex-1 bg-transparent border-none outline-none text-sm"
          @keyup.enter="saveEditedChat"
          @keyup.esc="cancelEdit"
          ref="editInput"
          autofocus
        />
        <BaseButton variant="ghost" size="sm" @click="saveEditedChat" class="h-8 w-8 p-0">
          <CheckIcon class="h-4 w-4 text-muted-foreground" />
        </BaseButton>
        <BaseButton variant="ghost" size="sm" @click="cancelEdit" class="h-8 w-8 p-0">
          <XIcon class="h-4 w-4 text-muted-foreground" />
        </BaseButton>
      </div>

      <!-- Normal view -->
      <div
        v-else
        class="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent transition-colors cursor-pointer"
        @click="goToChat(chat.id)"
      >
        <span class="text-sm truncate">{{ chat.name }}</span>

        <!-- Actions menu -->
        <div class="relative ml-2">
          <BaseButton
            variant="ghost"
            size="sm"
            @click.stop="toggleMenu(chat.id)"
            class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVerticalIcon class="h-4 w-4 text-muted-foreground" />
          </BaseButton>

          <!-- Dropdown -->
          <div
            v-if="menuOpenChatId === chat.id"
            class="absolute right-0 z-10 mt-1 w-40 bg-popover rounded-md shadow-md border border-border"
          >
            <div class="p-1">
              <button
                @click.stop="startEditChat(chat)"
                class="flex w-full items-center px-2 py-1.5 text-sm rounded hover:bg-muted"
              >
                <PencilIcon class="h-4 w-4 mr-2" />
                Rename
              </button>
              <button
                @click.stop="deleteChat(chat.id)"
                class="flex w-full items-center px-2 py-1.5 text-sm rounded hover:bg-muted text-destructive"
              >
                <TrashIcon class="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
