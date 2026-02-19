import { create } from 'zustand'

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

export const useAppStore = create<AppState>((set) => ({
  isListening: false,
  isProcessing: false,
  transcript: '',
  aiResponse: '',
  aiError: null,
  apiProvider: 'gemini',
  alwaysOnTop: false,
  hideFromScreenSharing: false,

  setIsListening: (value) => set({ isListening: value }),
  setIsProcessing: (value) => set({ isProcessing: value }),
  setTranscript: (value) => set({ transcript: value }),
  appendTranscript: (text) => set((state) => ({
    transcript: state.transcript + text
  })),
  clearTranscript: () => set({ transcript: '', aiResponse: '', aiError: null }),
  setAiResponse: (value) => set({ aiResponse: value }),
  setAiError: (value) => set({ aiError: value }),
  setApiProvider: (value) => set({ apiProvider: value }),
  setAlwaysOnTop: (value) => set({ alwaysOnTop: value }),
  setHideFromScreenSharing: (value) => set({ hideFromScreenSharing: value }),
  reset: () => set({
    isListening: false,
    isProcessing: false,
    transcript: '',
    aiResponse: '',
    aiError: null,
  }),
}))
