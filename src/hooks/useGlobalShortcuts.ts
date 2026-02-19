import { useEffect, useRef } from 'react'
import { register, unregisterAll, isRegistered } from '@tauri-apps/api/globalShortcut'
import { appWindow } from '@tauri-apps/api/window'

export const useGlobalShortcuts = (
  onToggleListening: () => void,
) => {
  // Use a ref to prevent multiple registration attempts during strict-mode double mounts
  const isSetupRef = useRef(false);

  useEffect(() => {
    const shortcut = 'Alt+Space';

    const setupShortcuts = async () => {
      try {
        // 1. Check if already registered to avoid errors
        const exists = await isRegistered(shortcut);
        if (exists) {
          await unregisterAll();
        }

        // 2. Register the Global Shortcut
        await register(shortcut, async () => {
          console.log(`Global shortcut ${shortcut} triggered`);
          
          // Ensure window is visible and active
          const isVisible = await appWindow.isVisible();
          if (!isVisible) {
            await appWindow.show();
          }
          await appWindow.setFocus();
          
          // Trigger the app logic
          onToggleListening();
        });

        isSetupRef.current = true;
      } catch (err) {
        console.error("Tauri: Global shortcut registration failed:", err);
      }
    }

    setupShortcuts();

    // Cleanup: Properly unregister when component unmounts
    return () => {
      unregisterAll().catch(console.error);
      isSetupRef.current = false;
    }
  }, [onToggleListening]);

  // LOCAL LISTENER (Standard Browser Spacebar)
  useEffect(() => {
    const handleLocalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      const isTyping = 
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement).isContentEditable;

      if (isTyping) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onToggleListening();
      }
    }

    window.addEventListener('keydown', handleLocalKeyDown);
    return () => window.removeEventListener('keydown', handleLocalKeyDown);
  }, [onToggleListening]);
}