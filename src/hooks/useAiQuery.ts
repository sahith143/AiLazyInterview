import { useCallback, useState } from 'react'
import { getClient, ResponseType, Body } from '@tauri-apps/api/http'
import { useAppStore } from '../store/useAppStore'

export const useAiQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { setIsProcessing, setAiResponse, setAiError, apiProvider } = useAppStore()

  const query = useCallback(async (transcript: string, apiKey: string) => {
    if (!transcript.trim() || !apiKey) return

    setIsProcessing(true)
    setIsLoading(true)
    setAiError(null)

    try {
      // 1. Initialize the Tauri native HTTP client
      const client = await getClient()
      
      let endpoint = ''
      let payload = {}
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // 2. Configure Request based on Provider
      if (apiProvider === 'gemini') {
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
        payload = {
          contents: [{ 
            parts: [{ 
              text: `You are a meeting assistant. Based on this transcript: "${transcript}", provide a concise summary or helpful insights.` 
            }] 
          }]
        }
      } else {
        endpoint = 'https://api.openai.com/v1/chat/completions'
        headers['Authorization'] = `Bearer ${apiKey}`
        payload = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: transcript }]
        }
      }

      // 3. Execute the request via Tauri Bridge
      const response = await client.post(endpoint, Body.json(payload), {
        headers,
        responseType: ResponseType.JSON,
        timeout: 30 // Set a 30-second timeout
      })

      // 4. Handle Results
      if (response.ok) {
        let aiText = ''
        const data = response.data as any

        if (apiProvider === 'gemini') {
          // Path: candidates -> content -> parts -> text
          aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
        } else {
          // Path: choices -> message -> content
          aiText = data?.choices?.[0]?.message?.content || 'No response from OpenAI.'
        }
        
        setAiResponse(aiText)
      } else {
        const errorData = response.data as any
        const message = errorData?.error?.message || `API Error: ${response.status}`
        setAiError(message)
      }
    } catch (error) {
      console.error('AI Query Error:', error)
      setAiError(`Connection failed: Check your internet or API allowlist in tauri.conf.json.`)
      setAiResponse('')
    } finally {
      setIsProcessing(false)
      setIsLoading(false)
    }
  }, [apiProvider, setIsProcessing, setAiResponse, setAiError])

  return { query, isLoading }
}