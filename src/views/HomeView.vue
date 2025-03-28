<script setup lang="ts">
import ChatList from '@/components/ChatList.vue'
</script>

<template>
  <div class="container mx-auto py-8 h-screen">
    <div class="flex flex-col items-center mb-8">
      <h1 class="text-3xl font-bold mb-2">AI Chat Assistant</h1>
      <p class="text-muted-foreground max-w-md text-center">
        Chat with advanced AI models including Google Gemini and GPT-4.
      </p>
    </div>

    <div
      class="max-w-4xl mx-auto bg-card rounded-lg shadow-md border border-border overflow-hidden h-[calc(100vh-200px)]"
    >
      <div class="h-full p-6">
        <ChatList />
      </div>
    </div>
  </div>
</template>
