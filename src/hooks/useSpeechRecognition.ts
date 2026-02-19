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
  
  // Track desired state to handle auto-restarts in Tauri/WebView2
  const shouldBeListening = useRef<boolean>(false)

  const { setIsListening, appendTranscript } = useAppStore()

  const createRecognition = useCallback(() => {
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      console.log("Speech: Microphone is active");
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        // Capture only finalized speech segments to prevent "double text"
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
      }
      
      if (finalTranscript) {
        appendTranscript(finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      // Silence 'no-speech' warnings to keep the UI clean
      if (event.error === 'no-speech') return

      let errorMessage = `Error: ${event.error}`
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error - Check your internet'
          break
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = 'Microphone access denied by system'
          break
      }
      setError(errorMessage)
      console.error('Speech Recognition Error:', event.error)
    }

    recognition.onend = () => {
      // Logic for Auto-Restart: If the user didn't hit 'stop', the engine timed out.
      // We restart it immediately to keep transcribing.
      if (shouldBeListening.current) {
        try {
          recognition.start()
        } catch (e) {
          // If restart fails, we'll try again on the next tick
          console.warn("Speech: Auto-restart failed, will retry...")
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

    setError(null)
    shouldBeListening.current = true
    
    // Always ensure we have a fresh recognition object if one doesn't exist
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition()
    }

    try {
      recognitionRef.current.start()
    } catch (err) {
      // If the engine is already running, this error is safe to ignore
      console.log("Speech: Engine already running")
    }
  }, [isSupported, createRecognition])

  const stopListening = useCallback(() => {
    shouldBeListening.current = false
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      // We also call abort to immediately release the mic
      recognitionRef.current.abort()
      recognitionRef.current = null // Clear the ref to force re-init next time
      setIsListening(false)
    }
  }, [setIsListening])

  // Cleanup on component unmount
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