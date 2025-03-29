<script setup lang="ts">
import { models } from '@/services/ai'
</script>

<template>
  <div class="container py-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">About Vue AI Chat</h1>

    <div class="bg-card border border-border rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">AI Models</h2>
      <p class="mb-4">This application uses multiple AI providers to power chat functionality:</p>

      <div class="space-y-4">
        <div class="bg-background border border-input rounded-md p-4">
          <h3 class="font-medium mb-2">OpenRouter</h3>
          <p class="text-sm text-muted-foreground mb-2">
            OpenRouter provides access to various LLMs including Gemini and GPT-4.
          </p>
          <div class="text-xs space-y-1">
            <div><span class="font-mono">Gemini 2.5 Pro:</span> {{ models.gemini }}</div>
            <div><span class="font-mono">GPT-4o:</span> {{ models.gpt4 }}</div>
          </div>
        </div>

        <div class="bg-background border border-input rounded-md p-4">
          <h3 class="font-medium mb-2">Azure AI</h3>
          <p class="text-sm text-muted-foreground mb-2">
            Azure OpenAI Service provides an enterprise-grade hosting option for OpenAI models.
          </p>
          <div class="text-xs space-y-1">
            <div><span class="font-mono">Model:</span> {{ models.azure }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-card border border-border rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Environment Setup</h2>
      <p class="mb-4">
        To run this application, you need to set up the following environment variables:
      </p>

      <div class="bg-background border border-input rounded-md p-4 overflow-x-auto">
        <pre class="text-xs">
# OpenRouter
VITE_OPENROUTER_API_KEY=your_key_here
VITE_OPENROUTER_SITE_URL=your_site_url
VITE_OPENROUTER_SITE_NAME=your_site_name

# Azure AI
VITE_AZURE_ENDPOINT=your_endpoint
VITE_AZURE_API_KEY=your_api_key
VITE_AZURE_MODEL=your_model_name

# Authentication
VITE_AUTH_ENABLED=true|false
        </pre>
      </div>
    </div>

    <div class="bg-card border border-border rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Browser Compatibility Notice</h2>
      <p class="mb-2">
        This application uses direct API calls from the browser with the
        <code>dangerouslyAllowBrowser</code> option enabled.
      </p>
      <div class="bg-destructive/10 text-destructive p-4 rounded-md text-sm">
        <p class="font-medium mb-1">⚠️ Warning</p>
        <p>
          In production, you should never expose API keys directly in browser code. Use a serverless
          function or backend service to proxy requests to AI providers.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
