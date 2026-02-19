import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { invoke } from '@tauri-apps/api/tauri'
import SettingsModal from './SettingsModal'
import styles from './Header.module.css'

export const Header: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const { alwaysOnTop, setAlwaysOnTop, hideFromScreenSharing, setHideFromScreenSharing } = useAppStore()

  const handleAlwaysOnTopChange = async (value: boolean) => {
    try {
      await invoke('set_always_on_top', { alwaysOnTop: value })
      setAlwaysOnTop(value)
    } catch (error) {
      console.error('Failed to set always on top:', error)
    }
  }

  const handleHideFromScreenSharingChange = async (value: boolean) => {
    try {
      if (value) {
        await invoke('set_window_opacity', { opacity: 0 })
        await invoke('set_ignore_cursor_events', { ignore: true })
        await invoke('set_skip_taskbar', { skip: true })
      } else {
        await invoke('set_window_opacity', { opacity: 1 })
        await invoke('set_ignore_cursor_events', { ignore: false })
        await invoke('set_skip_taskbar', { skip: false })
      }
      setHideFromScreenSharing(value)
    } catch (error) {
      console.error('Failed to toggle screen sharing hide:', error)
    }
  }

  return (
    <>
      <header className={styles.header} data-tauri-drag-region>
        <div className={styles.left}>
          <h1 className={styles.title}>Angel AI</h1>
        </div>

        <div className={styles.right}>
          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={hideFromScreenSharing}
                onChange={(e) => handleHideFromScreenSharingChange(e.target.checked)}
                className={styles.hiddenCheckbox}
              />
              <span className={styles.toggleText}>Hide from Sharing</span>
            </label>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className={styles.settingsButton}
            title="Settings"
            aria-label="Open settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
            </svg>
          </button>
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}

export default Header
