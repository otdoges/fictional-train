import OpenRouter from 'openrouter-sdk'

// Define the API key - in a real app, this would be in .env
const OPENROUTER_API_KEY = 'your-openrouter-api-key'

// Initialize the OpenRouter client
const openrouter = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

// Defines available models
export const models = {
  gemini: 'google/gemini-1.5-pro-latest',
  gpt4: 'openai/gpt-4o',
}

// Type for chat messages
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterMessage {
  role: string
  content: string
}

export const ai = {
  async chat(messages: ChatMessage[], model = models.gemini) {
    try {
      const response = await openrouter.chat.completions.create({
        model,
        messages: messages as OpenRouterMessage[],
        temperature: 0.7,
        stream: false,
      })

      return {
        content: response.choices[0].message.content,
        model: response.model,
      }
    } catch (error) {
      console.error('Error calling AI:', error)
      throw new Error('Failed to get AI response')
    }
  },

  async streamChat(
    messages: ChatMessage[],
    model = models.gemini,
    onChunk: (chunk: string) => void,
  ) {
    try {
      const response = await openrouter.chat.completions.create({
        model,
        messages: messages as OpenRouterMessage[],
        temperature: 0.7,
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
