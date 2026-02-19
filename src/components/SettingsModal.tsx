import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { apiProvider, setApiProvider } = useAppStore()
  const [apiKey, setApiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 1. Load keys from LocalStorage on mount
  useEffect(() => {
    const key = localStorage.getItem(`api_key_${apiProvider}`) || ''
    setApiKey(key)
  }, [apiProvider])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API key cannot be empty' })
      return
    }

    setIsSaving(true)
    try {
      // We store the key securely in the browser's local storage context
      localStorage.setItem(`api_key_${apiProvider}`, apiKey.trim())
      
      setMessage({ type: 'success', text: `${apiProvider.toUpperCase()} key saved!` })
      
      // Auto-clear success message
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save to local storage.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    if (!confirm('Clear this API key?')) return
    localStorage.removeItem(`api_key_${apiProvider}`)
    setApiKey('')
    setMessage({ type: 'success', text: 'Key removed' })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
             <h2 className={styles.title}>Settings</h2>
             <span className={styles.badge}>v0.1.0</span>
          </div>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label}>AI Provider</label>
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              className={styles.select}
            >
              <option value="gemini">Google Gemini (Recommended)</option>
              <option value="openai">OpenAI (GPT-3.5/4)</option>
            </select>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              {apiProvider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your key here..."
                className={styles.input}
              />
            </div>
            <p className={styles.helpText}>
              Your key is stored locally on this device and never shared.
            </p>
          </div>

          <div className={styles.noticeBox}>
            <h4>🔒 Privacy & Security</h4>
            <p>
              Angel AI processes audio in real-time. Transcripts are sent to 
              <strong> {apiProvider === 'gemini' ? 'Google' : 'OpenAI'}</strong> 
              only when you trigger an analysis.
            </p>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={handleClear}
              className={styles.clearBtn}
              disabled={!apiKey}
            >
              Delete Key
            </button>
            <button
              onClick={handleSave}
              className={styles.saveBtn}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal