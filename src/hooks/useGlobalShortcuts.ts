import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useAppStore } from '../store/useAppStore'

export const useGlobalShortcuts = (
  onSpacebar: () => void,
) => {
  const { transcript, isListening } = useAppStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        onSpacebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSpacebar])
}
