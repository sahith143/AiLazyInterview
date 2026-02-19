import { useEffect, useCallback } from 'react'
import { useAppStore } from './store/useAppStore'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts'
import { useAiQuery } from './hooks/useAiQuery'
import Header from './components/Header'
import TranscriptLog from './components/TranscriptLog'
import MicrophoneButton from './components/MicrophoneButton'
import AIResponse from './components/AIResponse'
import Controls from './components/Controls'
import './App.css'

function App() {
  const { isListening, transcript, clearTranscript, setIsListening } = useAppStore()
  const { startListening, stopListening } = useSpeechRecognition()
  const { query } = useAiQuery()

  useGlobalShortcuts(
    useCallback(() => {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }
    }, [isListening, startListening, stopListening]),
  )

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleRecognitionEnd = () => {
      timer = setTimeout(() => {
        if (transcript.trim()) {
          queryAI()
        }
      }, 500)
    }

    return () => clearTimeout(timer)
  }, [isListening, transcript])

  const toggleRecording = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      clearTranscript()
      startListening()
    }
  }, [isListening, startListening, stopListening, clearTranscript])

  const queryAI = useCallback(async () => {
    if (!transcript.trim()) return

    const apiKey = localStorage.getItem('api_key_gemini') ||
      localStorage.getItem('api_key_openai')

    if (apiKey) {
      await query(transcript, apiKey)
    }
  }, [transcript, query])

  const handleReset = useCallback(() => {
    if (isListening) {
      stopListening()
    }
    clearTranscript()
  }, [isListening, stopListening, clearTranscript])

  return (
    <div className="app">
      <Header />
      <main className="main">
        <TranscriptLog />
        <MicrophoneButton onClick={toggleRecording} />
        <AIResponse />
        <Controls onReset={handleReset} />
      </main>
    </div>
  )
}

export default App
