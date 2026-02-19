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
        // Handle spacing and prevent duplicate phrases from speech recognition "isFinal" events
        const cleanText = text.trim();
        if (!cleanText) return state;
        
        const currentTranscript = state.transcript.trim();
        
        // Prevent repeating exactly what was just said
        if (currentTranscript.endsWith(cleanText)) return state;
        
        const newTranscript = currentTranscript 
          ? `${currentTranscript} ${cleanText}` 
          : cleanText;

        return { transcript: newTranscript };
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
        try {
          // Native Tauri bridge call
          await appWindow.setAlwaysOnTop(value);
        } catch (err) {
          console.error("Native Bridge Error: setAlwaysOnTop failed", err);
        }
      },

      setHideFromScreenSharing: async (value) => {
        set({ hideFromScreenSharing: value });
        try {
          // setContentProtected is supported on Windows and macOS
          await (appWindow as any).setContentProtected(value);
        } catch (err) {
          console.warn("Native Bridge Error: Content protection not available", err);
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
      name: 'angel-ai-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user preferences. 
      // Do NOT persist 'transcript' or 'isListening' to avoid 
      // the mic turning on automatically upon app launch.
      partialize: (state) => ({ 
        apiProvider: state.apiProvider, 
        alwaysOnTop: state.alwaysOnTop,
        hideFromScreenSharing: state.hideFromScreenSharing 
      }),
      // This ensures that when the app rehydrates, isListening is always false
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isListening = false;
          state.isProcessing = false;
          // Apply native settings on load
          appWindow.setAlwaysOnTop(state.alwaysOnTop).catch(() => {});
        }
      }
    }
  )
)