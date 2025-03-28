<script setup lang="ts">
import ChatList from '@/components/ChatList.vue'
</script>

<template>
  <div class="container mx-auto py-6 h-[calc(100vh-60px)]">
    <div class="flex flex-col items-center mb-6">
      <h1 class="text-2xl font-bold mb-2">Your Conversations</h1>
      <p class="text-muted-foreground max-w-md text-center">
        Chat with advanced AI models including Google Gemini and Azure AI.
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
