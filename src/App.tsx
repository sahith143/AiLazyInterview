import { useEffect, useCallback } from 'react'
import { appWindow } from '@tauri-apps/api/window' // Required for Hide/Show
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

  // 1. MANDATORY: Trigger Microphone Permission & System Check
  useEffect(() => {
    const initPermissions = async () => {
      try {
        // This forces the OS/WebView to prompt for Mic access
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted");
      } catch (err) {
        console.error("Microphone access denied or blocked by CSP:", err);
      }
    };
    initPermissions();
  }, []);

  // 2. Window Control Logic (Fixes the "Hidden" issue)
  const toggleVisibility = useCallback(async (visible: boolean) => {
    if (visible) {
      await appWindow.show();
      await appWindow.setFocus();
    } else {
      await appWindow.hide();
    }
  }, []);

  // 3. Global Shortcut Handler
  useGlobalShortcuts(
    useCallback(() => {
      if (isListening) {
        stopListening();
        // Option: toggleVisibility(false); // Hide window when done listening
      } else {
        toggleVisibility(true); // Ensure window is visible when listening starts
        startListening();
      }
    }, [isListening, startListening, stopListening, toggleVisibility]),
  )

  // 4. AI Query Logic (Fixed to use .env values)
  const queryAI = useCallback(async () => {
    if (!transcript.trim()) return

    // Priority: .env (Vite) > localStorage
    const geminiKey = import.meta.env.VITE_API_KEY_GEMINI || localStorage.getItem('api_key_gemini');
    const openaiKey = import.meta.env.VITE_API_KEY_OPENAI || localStorage.getItem('api_key_openai');
    
    const activeKey = geminiKey || openaiKey;

    if (activeKey) {
      await query(transcript, activeKey);
    } else {
      console.error("No API Key found in .env or Settings");
    }
  }, [transcript, query]);

  // Handle auto-query when user stops talking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isListening && transcript.trim()) {
      timer = setTimeout(() => {
        queryAI();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isListening, transcript, queryAI]);

  const toggleRecording = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      clearTranscript()
      startListening()
    }
  }, [isListening, startListening, stopListening, clearTranscript])

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
        <div className="controls-container">
           <MicrophoneButton onClick={toggleRecording} />
           {/* Add a manual hide button to test visibility logic */}
           <button 
             onClick={() => appWindow.hide()} 
             className="hide-btn"
             title="Hide to Tray"
           >
             Hide
           </button>
        </div>
        <AIResponse />
        <Controls onReset={handleReset} />
      </main>
    </div>
  )
}

export default App