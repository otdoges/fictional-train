<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (value: string) => ['user', 'assistant', 'system'].includes(value),
  },
  content: {
    type: String,
    required: true,
  },
})

const isUser = computed(() => props.role === 'user')
</script>

<template>
  <div
    :class="[
      'p-4 md:p-6 border-b last:border-0 border-border transition-colors',
      isUser ? 'bg-background' : 'bg-muted/20',
    ]"
  >
    <div class="flex gap-3 max-w-4xl mx-auto">
      <div class="flex-shrink-0">
        <div
          :class="[
            'flex items-center justify-center w-8 h-8 rounded-full',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground',
          ]"
        >
          <span class="text-xs font-medium">{{ isUser ? 'U' : 'AI' }}</span>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center mb-1">
          <span :class="['text-xs font-semibold', isUser ? 'text-foreground' : 'text-primary']">
            {{ isUser ? 'You' : 'AI Assistant' }}
          </span>
        </div>

        <div class="prose prose-sm dark:prose-invert max-w-none break-words">
          {{ content }}
        </div>
      </div>
    </div>
  </div>
</template>
