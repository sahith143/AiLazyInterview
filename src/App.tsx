import { useEffect, useCallback, useRef } from 'react'
import { appWindow } from '@tauri-apps/api/window'
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
  const { isListening, transcript, clearTranscript } = useAppStore()
  const { startListening, stopListening } = useSpeechRecognition()
  const { query } = useAiQuery()
  
  const transcriptRef = useRef(transcript);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  useEffect(() => {
    const initPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("System: Microphone access secured.");
      } catch (err) {
        console.error("System: Microphone blocked.", err);
      }
    };
    initPermissions();
  }, []);

  const toggleVisibility = useCallback(async (visible: boolean) => {
    try {
      if (visible) {
        await appWindow.show();
        await appWindow.setFocus();
      } else {
        await appWindow.hide();
      }
    } catch (err) {
      console.error("Tauri: Window command failed", err);
    }
  }, []);

  const queryAI = useCallback(async () => {
    const currentText = transcriptRef.current.trim();
    if (!currentText) return;

    const geminiKey = import.meta.env.VITE_API_KEY_GEMINI || localStorage.getItem('api_key_gemini');
    const openaiKey = import.meta.env.VITE_API_KEY_OPENAI || localStorage.getItem('api_key_openai');
    const activeKey = geminiKey || openaiKey;

    if (activeKey) {
      await query(currentText, activeKey);
    }
  }, [query]);

  useGlobalShortcuts(
    useCallback(() => {
      if (isListening) {
        stopListening();
      } else {
        toggleVisibility(true);
        clearTranscript();
        startListening();
      }
    }, [isListening, startListening, stopListening, toggleVisibility, clearTranscript]),
  )

  useEffect(() => {
    let timer: number;
    if (!isListening && transcript.trim().length > 0) {
      timer = window.setTimeout(() => {
        queryAI();
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [isListening, queryAI]);

  const toggleRecording = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      clearTranscript()
      startListening()
    }
  }, [isListening, startListening, stopListening, clearTranscript])

  // FIXED HIDE HANDLER
  const handleHideWindow = async () => {
    try {
      await appWindow.hide();
    } catch (error) {
      console.error("Failed to hide window:", error);
    }
  };

  return (
    <div className="app">
      <div className="titlebar" data-tauri-drag-region>
        <Header />
      </div>

      <main className="main">
        <TranscriptLog />
        
        <div className="controls-container">
           <MicrophoneButton onClick={toggleRecording} />
           <button 
             onClick={handleHideWindow} 
             className="hide-btn"
           >
             Hide Assistant
           </button>
        </div>

        <AIResponse />
        <Controls onReset={() => {
          stopListening();
          clearTranscript();
        }} />
      </main>
    </div>
  )
}

export default App