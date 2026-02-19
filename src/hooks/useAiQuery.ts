import { useCallback, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
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

    try {
      const result = await invoke<AiQueryResponse>('query_ai', {
        transcript: transcript.trim(),
        apiKey,
        apiProvider,
      })

      if (result.error) {
        setAiError(result.error)
        setAiResponse('')
      } else {
        setAiResponse(result.response)
        setAiError(null)
      }
    } catch (error) {
      setAiError(`Failed to query AI: ${error}`)
      setAiResponse('')
    } finally {
      setIsProcessing(false)
      setIsLoading(false)
    }
  }, [apiProvider, setIsProcessing, setAiResponse, setAiError])

  return { query, isLoading }
}
