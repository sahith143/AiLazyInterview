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
      const client = await getClient()
      const resume = localStorage.getItem('user_resume') || ''; // Fetch stored resume
      
      let endpoint = ''
      let payload = {}
      let headers: Record<string, string> = { 'Content-Type': 'application/json' }

      // 1. Configure Request for Gemini (Optimized for gemini-1.5-flash)
      if (apiProvider === 'gemini') {
        // Updated model to gemini-1.5-flash for speed
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
        payload = {
          contents: [{ 
            parts: [{ 
              text: `
                Persona: You are a professional interview proxy. 
                Resume Context: ${resume}
                Task: Based on this transcript: "${transcript}", provide a human-like, concise answer.
                Strict Rules: Use resume details. Keep under 3 sentences. No AI mentions.
              ` 
            }] 
          }]
        }
      } 
      // 2. Configure Request for OpenAI (Optimized for gpt-4o-mini)
      else {
        endpoint = 'https://api.openai.com/v1/chat/completions'
        headers['Authorization'] = `Bearer ${apiKey}`
        payload = {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are an interview assistant. Resume: ${resume}` },
            { role: 'user', content: transcript }
          ]
        }
      }

      const response = await client.post(endpoint, Body.json(payload), {
        headers,
        responseType: ResponseType.JSON,
        timeout: 30
      })

      if (response.ok) {
        const data = response.data as any
        const aiText = apiProvider === 'gemini' 
          ? data?.candidates?.[0]?.content?.parts?.[0]?.text 
          : data?.choices?.[0]?.message?.content;
        
        setAiResponse(aiText || 'No response generated.')
      } else {
        const errorData = response.data as any
        setAiError(errorData?.error?.message || `API Error: ${response.status}`)
      }
    } catch (error) {
      setAiError(`Connection failed: Check internet or tauri.conf.json allowlist.`)
    } finally {
      setIsProcessing(false)
      setIsLoading(false)
    }
  }, [apiProvider, setIsProcessing, setAiResponse, setAiError])

  return { query, isLoading }
}