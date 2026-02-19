import React, { useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { useAppStore } from '../store/useAppStore'
import SettingsModal from './SettingsModal'
import ResumeModal from './ResumeModal' // New Component
import styles from './Header.module.css'

export const Header: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [showResume, setShowResume] = useState(false)
  
  const { 
    alwaysOnTop, 
    setAlwaysOnTop, 
    hideFromScreenSharing, 
    setHideFromScreenSharing 
  } = useAppStore()

  // Improved Native Logic
  const handleAlwaysOnTopChange = async (value: boolean) => {
    try {
      await appWindow.setAlwaysOnTop(value)
      setAlwaysOnTop(value)
    } catch (error) {
      console.error('Tauri: Pin failed:', error)
    }
  }

  const handlePrivacyToggle = async (value: boolean) => {
    try {
      // Native Content Protection (makes window black in screen shares)
      if ((appWindow as any).setContentProtected) {
        await (appWindow as any).setContentProtected(value)
      }
      setHideFromScreenSharing(value)
    } catch (error) {
      console.error('Tauri: Privacy toggle failed:', error)
    }
  }

  return (
    <>
      <header className={styles.header} data-tauri-drag-region>
        {/* Drag Region Anchor */}
        <div className={styles.left} style={{ pointerEvents: 'none' }}>
          <div className={styles.logoBadge}>ANGEL</div>
          <h1 className={styles.title}>AI Assistant</h1>
        </div>

        <div className={styles.right}>
          <div className={styles.toggleGroup}>
             {/* Resume Context Button */}
             <button 
                className={`${styles.contextBtn} ${localStorage.getItem('user_resume') ? styles.active : ''}`}
                onClick={() => setShowResume(true)}
                title="Paste Resume for Context"
             >
               📄 Resume
             </button>

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
                onChange={(e) => handlePrivacyToggle(e.target.checked)}
              />
              <span className={styles.toggleText}>Privacy</span>
            </label>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className={styles.iconButton}
            title="Settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          <div className={styles.windowActions}>
            <button onClick={() => appWindow.minimize()} className={styles.minusBtn}>—</button>
            <button onClick={() => appWindow.close()} className={styles.closeBtn}>×</button>
          </div>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
    </>
  )
}

export default Header