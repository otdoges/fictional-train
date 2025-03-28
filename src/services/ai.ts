import OpenAI from 'openai'

// OpenRouter client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': import.meta.env.VITE_OPENROUTER_SITE_URL || window.location.origin,
    'X-Title': import.meta.env.VITE_OPENROUTER_SITE_NAME || 'Vue AI Chat',
  },
})

// Defines available models
export const models = {
  gemini: 'google/gemini-2.5-pro-exp-03-25:free',
  gpt4: 'openai/gpt-4o',
}

// Azure client for the second provider
// For static sites, we need to use a backend service to proxy requests
// This is a placeholder - in production, you'd use an API route or serverless function
async function callAzureAI(messages: ChatMessage[]) {
  try {
    // In a static site, we'd call a serverless function here
    // Example: const response = await fetch('/api/azure-ai', { method: 'POST', body: JSON.stringify({ messages }) })
    // For now, we'll fall back to OpenRouter
    console.warn('Azure AI client would be called here in production - using OpenRouter fallback')

    const response = await openai.chat.completions.create({
      model: models.gpt4,
      messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
    })

    return {
      content: response.choices[0].message.content || '',
      model: 'azure-ai (fallback to OpenRouter)',
    }
  } catch (error) {
    console.error('Error calling Azure AI:', error)
    throw new Error('Failed to get Azure AI response')
  }
}

// Type for chat messages
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export const ai = {
  async chat(messages: ChatMessage[], useAzure = false, model = models.gemini) {
    try {
      if (useAzure) {
        return await callAzureAI(messages)
      }

      const response = await openai.chat.completions.create({
        model,
        messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      })

      return {
        content: response.choices[0].message.content || '',
        model: response.model,
      }
    } catch (error) {
      console.error('Error calling AI:', error)
      throw new Error('Failed to get AI response')
    }
  },

  async streamChat(
    messages: ChatMessage[],
    useAzure = false,
    model = models.gemini,
    onChunk: (chunk: string) => void,
  ) {
    try {
      if (useAzure) {
        // Azure doesn't support streaming in this implementation
        // Return non-streaming response
        const response = await callAzureAI(messages)
        onChunk(response.content)
        return response
      }

      const response = await openai.chat.completions.create({
        model,
        messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
        stream: true,
      })

      let fullContent = ''

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          fullContent += content
          onChunk(content)
        }
      }

      return {
        content: fullContent,
        model,
      }
    } catch (error) {
      console.error('Error streaming AI response:', error)
      throw new Error('Failed to stream AI response')
    }
  },
}
