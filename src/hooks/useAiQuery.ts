import { useCallback, useState } from 'react'
import { getClient, ResponseType } from '@tauri-apps/api/http' // Use Tauri's HTTP client for better security
import { useAppStore } from '../store/useAppStore'

interface AiQueryResponse {
  response: string
  error: string | null
}

export const useAiQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { setIsProcessing, setAiResponse, setAiError, apiProvider } = useAppStore()

  const query = useCallback(async (transcript: string, apiKey: string) => {
    if (!transcript.trim() || !apiKey) return

    setIsProcessing(true)
    setIsLoading(true)
    setAiError(null)

    try {
      // Use Tauri's specialized HTTP client to bypass CORS issues
      const client = await getClient()
      
      let endpoint = ''
      let payload = {}
      let headers = {
        'Content-Type': 'application/json'
      }

      if (apiProvider === 'gemini') {
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
        payload = {
          contents: [{ parts: [{ text: `You are a meeting assistant. Based on this transcript: "${transcript}", provide a concise summary or helpful insights.` }] }]
        }
      } else {
        // Fallback to OpenAI
        endpoint = 'https://api.openai.com/v1/chat/completions'
        headers['Authorization'] = `Bearer ${apiKey}`
        payload = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: transcript }]
        }
      }

      const response = await client.post(endpoint, payload, {
        headers,
        responseType: ResponseType.JSON
      })

      if (response.ok) {
        // Extracting text based on provider structure
        let aiText = ''
        if (apiProvider === 'gemini') {
          aiText = response.data.candidates[0].content.parts[0].text
        } else {
          aiText = response.data.choices[0].message.content
        }
        
        setAiResponse(aiText)
      } else {
        const errorData = response.data as any
        setAiError(errorData?.error?.message || 'API request failed')
      }
    } catch (error) {
      console.error('AI Query Error:', error)
      setAiError(`Network error: Ensure your API key is correct and you have internet access.`)
      setAiResponse('')
    } finally {
      setIsProcessing(false)
      setIsLoading(false)
    }
  }, [apiProvider, setIsProcessing, setAiResponse, setAiError])

  return { query, isLoading }
}