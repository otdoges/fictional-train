<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  role: 'user' | 'assistant'
  content: string
}>()

const isUser = computed(() => props.role === 'user')
</script>

<template>
  <div
    class="flex w-full gap-4 p-4 border-b border-border"
    :class="isUser ? 'bg-muted/40' : 'bg-background'"
  >
    <div
      class="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border text-sm"
      :class="isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'"
    >
      {{ isUser ? 'U' : 'AI' }}
    </div>
    <div class="flex-1 space-y-2">
      <div class="prose break-words dark:prose-invert">
        {{ content }}
      </div>
    </div>
  </div>
</template>
