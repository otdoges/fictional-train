import OpenAI from 'openai'

// OpenRouter client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': import.meta.env.VITE_OPENROUTER_SITE_URL || window.location.origin,
    'X-Title': import.meta.env.VITE_OPENROUTER_SITE_NAME || 'Vue AI Chat',
  },
  dangerouslyAllowBrowser: true,
})

// Azure OpenAI client
const azureClient = new OpenAI({
  apiKey: import.meta.env.VITE_AZURE_API_KEY || '',
  baseURL: import.meta.env.VITE_AZURE_ENDPOINT || '',
  defaultQuery: { 'api-version': '2023-12-01-preview' },
  defaultHeaders: { 'api-key': import.meta.env.VITE_AZURE_API_KEY || '' },
  dangerouslyAllowBrowser: true,
})

// Defines available models
export const models = {
  gemini: 'google/gemini-2.5-pro-exp-03-25:free',
  gpt4: 'openai/gpt-4o',
  azure: import.meta.env.VITE_AZURE_MODEL || 'gpt-4o',
}

// Azure client implementation
async function callAzureAI(messages: ChatMessage[]) {
  try {
    // Use the Azure client to make requests
    const response = await azureClient.chat.completions.create({
      model: models.azure,
      messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
    })

    return {
      content: response.choices[0].message.content || '',
      model: `azure-ai (${models.azure})`,
    }
  } catch (error) {
    console.error('Error calling Azure AI:', error)

    // Fallback to OpenRouter if Azure fails
    console.warn('Falling back to OpenRouter')
    const response = await openai.chat.completions.create({
      model: models.gpt4,
      messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
    })

    return {
      content: response.choices[0].message.content || '',
      model: 'azure-ai (fallback to OpenRouter)',
    }
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
        try {
          // Use Azure streaming
          const response = await azureClient.chat.completions.create({
            model: models.azure,
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
            model: `azure-ai (${models.azure})`,
          }
        } catch (error) {
          console.error('Error streaming from Azure:', error)
          console.warn('Falling back to non-streaming Azure response')

          // Fallback to non-streaming response
          const response = await callAzureAI(messages)
          onChunk(response.content)
          return response
        }
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
