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
  
  // Ref to track if we *should* be listening (prevents unwanted auto-stops)
  const shouldBeListening = useRef<boolean>(false)

  const { setIsListening, appendTranscript } = useAppStore()

  const initRecognition = useCallback(() => {
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        }
      }
      
      if (finalTranscript) {
        appendTranscript(finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      // Ignore 'no-speech' error to prevent the app from appearing "broken" 
      // when the user is just thinking.
      if (event.error === 'no-speech') return

      let errorMessage = `Error: ${event.error}`
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error - check connection'
          break
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = 'Microphone access denied'
          break
      }
      setError(errorMessage)
      console.error('Speech Recognition Error:', event.error)
    }

    recognition.onend = () => {
      // In Tauri, the engine sometimes times out. 
      // If we didn't manually click "stop", restart it.
      if (shouldBeListening.current) {
        try {
          recognition.start()
        } catch (e) {
          console.error("Failed to restart recognition:", e)
        }
      } else {
        setIsListening(false)
      }
    }

    return recognition
  }, [setIsListening, appendTranscript])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition not supported')
      return
    }

    shouldBeListening.current = true
    
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition()
    }

    try {
      recognitionRef.current.start()
    } catch (err) {
      // If already started, ignore. If crashed, re-init.
      console.warn("Recognition already active or failed to start")
    }
  }, [isSupported, initRecognition])

  const stopListening = useCallback(() => {
    shouldBeListening.current = false
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }, [setIsListening])

  useEffect(() => {
    return () => {
      shouldBeListening.current = false
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return { startListening, stopListening, isSupported, error }
}