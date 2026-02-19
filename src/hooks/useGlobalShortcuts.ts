import { useEffect } from 'react'
import { register, unregisterAll } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'
import { useAppStore } from '../store/useAppStore'

export const useGlobalShortcuts = (
  onToggleListening: () => void,
) => {
  useEffect(() => {
    const setupShortcuts = async () => {
      try {
        // Unregister all to prevent "shortcut already registered" errors on hot-reload
        await unregisterAll();

        // Register Alt+Space as the global trigger
        // (Space alone is risky globally as it interferes with typing)
        await register('Alt+Space', async () => {
          console.log('Global shortcut Alt+Space triggered');
          
          // 1. Ensure the window comes to front if needed
          await appWindow.show();
          await appWindow.setFocus();
          
          // 2. Trigger the listening toggle
          onToggleListening();
        });

      } catch (err) {
        console.error("Failed to register global shortcut:", err);
      }
    }

    setupShortcuts();

    // Cleanup: Unregister shortcuts when the component unmounts
    return () => {
      unregisterAll();
    }
  }, [onToggleListening])

  // We still keep a local listener for when the app is focused 
  // so the user can use just 'Space' inside the app window.
  useEffect(() => {
    const handleLocalKeyDown = (e: KeyboardEvent) => {
      // If user is typing in an input, don't trigger the shortcut
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onToggleListening();
      }
    }

    window.addEventListener('keydown', handleLocalKeyDown);
    return () => window.removeEventListener('keydown', handleLocalKeyDown);
  }, [onToggleListening]);
}