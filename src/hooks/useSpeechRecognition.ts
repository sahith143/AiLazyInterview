import { useEffect, useState, useRef, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'

declare global {
  interface Window {
    webkitSpeechRecognition?: any
    SpeechRecognition?: any
  }
}

const SpeechRecognition = typeof window !== 'undefined'
  ? (window.webkitSpeechRecognition || window.SpeechRecognition)
  : null

interface UseSpeechRecognitionReturn {
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
  error: string | null
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isSupported] = useState(() => !!SpeechRecognition)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const interimTranscriptRef = useRef<string>('')

  const { setIsListening, setTranscript, appendTranscript } = useAppStore()

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported in this browser')
      return
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
        interimTranscriptRef.current = ''
      }

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            appendTranscript(transcript + ' ')
          } else {
            interimTranscript += transcript
          }
        }
        interimTranscriptRef.current = interimTranscript
      }

      recognitionRef.current.onerror = (event: any) => {
        let errorMessage = 'Speech recognition error'
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error - check your internet connection'
            break
          case 'no-speech':
            errorMessage = 'No speech detected'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied'
            break
          case 'permission-denied':
            errorMessage = 'Permission denied for microphone'
            break
        }
        setError(errorMessage)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    try {
      recognitionRef.current.start()
    } catch (err) {
      setError('Failed to start listening')
    }
  }, [isSupported, setIsListening, appendTranscript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [setIsListening])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return { startListening, stopListening, isSupported, error }
}
