import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { appWindow } from '@tauri-apps/api/window'

export interface AppState {
  isListening: boolean
  isProcessing: boolean
  transcript: string
  aiResponse: string
  aiError: string | null
  apiProvider: string
  alwaysOnTop: boolean
  hideFromScreenSharing: boolean

  setIsListening: (value: boolean) => void
  setIsProcessing: (value: boolean) => void
  setTranscript: (value: string) => void
  appendTranscript: (text: string) => void
  clearTranscript: () => void
  setAiResponse: (value: string) => void
  setAiError: (value: string | null) => void
  setApiProvider: (value: string) => void
  setAlwaysOnTop: (value: boolean) => void
  setHideFromScreenSharing: (value: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- State ---
      isListening: false,
      isProcessing: false,
      transcript: '',
      aiResponse: '',
      aiError: null,
      apiProvider: 'gemini',
      alwaysOnTop: false,
      hideFromScreenSharing: false,

      // --- Actions ---
      setIsListening: (value) => set({ isListening: value }),
      setIsProcessing: (value) => set({ isProcessing: value }),
      setTranscript: (value) => set({ transcript: value }),
      
      appendTranscript: (text) => set((state) => {
        // Prevent duplicate appending of the same string if the speech engine double-fires
        if (state.transcript.endsWith(text)) return state;
        return { transcript: state.transcript + text };
      }),

      clearTranscript: () => set({ 
        transcript: '', 
        aiResponse: '', 
        aiError: null,
        isProcessing: false 
      }),

      setAiResponse: (value) => set({ aiResponse: value }),
      setAiError: (value) => set({ aiError: value }),
      setApiProvider: (value) => set({ apiProvider: value }),

      setAlwaysOnTop: async (value) => {
        set({ alwaysOnTop: value });
        // Sync with the actual native window
        try {
          await appWindow.setAlwaysOnTop(value);
        } catch (err) {
          console.error("Failed to set native AlwaysOnTop:", err);
        }
      },

      setHideFromScreenSharing: async (value) => {
        set({ hideFromScreenSharing: value });
        // Note: This requires specific Tauri permissions in tauri.conf.json
        try {
          await (appWindow as any).setContentProtected(value);
        } catch (err) {
          console.warn("Content protection not supported on this platform/setup");
        }
      },

      reset: () => set({
        isListening: false,
        isProcessing: false,
        transcript: '',
        aiResponse: '',
        aiError: null,
      }),
    }),
    {
      name: 'angel-ai-storage', // Key for local storage
      storage: createJSONStorage(() => localStorage),
      // Only persist settings, not the temporary transcript/AI status
      partialize: (state) => ({ 
        apiProvider: state.apiProvider, 
        alwaysOnTop: state.alwaysOnTop,
        hideFromScreenSharing: state.hideFromScreenSharing 
      }),
    }
  )
)