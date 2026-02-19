import React, { useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { useAppStore } from '../store/useAppStore'
import SettingsModal from './SettingsModal'
import styles from './Header.module.css'

export const Header: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const { 
    alwaysOnTop, 
    setAlwaysOnTop, 
    hideFromScreenSharing, 
    setHideFromScreenSharing 
  } = useAppStore()

  // 1. Improved Always on Top Logic using Native API
  const handleAlwaysOnTopChange = async (value: boolean) => {
    try {
      await appWindow.setAlwaysOnTop(value)
      setAlwaysOnTop(value)
    } catch (error) {
      console.error('Tauri: Failed to set always on top:', error)
    }
  }

  // 2. Fixed Screen Sharing Protection
  // Note: setContentProtected(true) makes the window appear black/blank 
  // on screen recording/sharing software without hiding it from the user.
  const handleHideFromScreenSharingChange = async (value: boolean) => {
    try {
      // Use the native content protection API if available
      if ((appWindow as any).setContentProtected) {
        await (appWindow as any).setContentProtected(value)
      }
      setHideFromScreenSharing(value)
    } catch (error) {
      console.error('Tauri: Failed to toggle content protection:', error)
    }
  }

  // 3. Window Control Helpers
  const handleMinimize = () => appWindow.minimize()
  const handleClose = () => appWindow.close()

  return (
    <>
      {/* data-tauri-drag-region allows you to click and drag the app here */}
      <header className={styles.header} data-tauri-drag-region>
        <div className={styles.left} style={{ pointerEvents: 'none' }}>
          <h1 className={styles.title}>Angel AI</h1>
        </div>

        <div className={styles.right}>
          <div className={styles.toggleGroup}>
             <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={alwaysOnTop}
                  onChange={(e) => handleAlwaysOnTopChange(e.target.checked)}
                />
                <span className={styles.toggleText}>Pin</span>
             </label>

            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={hideFromScreenSharing}
                onChange={(e) => handleHideFromScreenSharingChange(e.target.checked)}
              />
              <span className={styles.toggleText}>Privacy</span>
            </label>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className={styles.iconButton}
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          <div className={styles.windowActions}>
            <button onClick={handleMinimize} className={styles.minusBtn}>—</button>
            <button onClick={handleClose} className={styles.closeBtn}>×</button>
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}

export default Header