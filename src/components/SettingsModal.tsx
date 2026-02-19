import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useAppStore } from '../store/useAppStore'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { apiProvider, setApiProvider } = useAppStore()
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadApiKey()
  }, [apiProvider])

  const loadApiKey = async () => {
    setIsLoading(true)
    try {
      const key = await invoke<string | null>('load_api_key', { provider: apiProvider })
      setApiKey(key || '')
    } catch (error) {
      console.error('Failed to load API key:', error)
      setMessage({ type: 'error', text: 'Failed to load API key' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API key cannot be empty' })
      return
    }

    setIsSaving(true)
    try {
      await invoke('save_api_key', { provider: apiProvider, apiKey: apiKey.trim() })
      setMessage({ type: 'success', text: 'API key saved successfully' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to save API key: ${error}` })
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear the API key?')) return

    setIsSaving(true)
    try {
      await invoke('clear_api_key', { provider: apiProvider })
      setApiKey('')
      setMessage({ type: 'success', text: 'API key cleared' })
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to clear API key: ${error}` })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3>API Provider</h3>
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              className={styles.select}
              disabled={isLoading}
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              API Key
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${apiProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API key`}
                className={styles.input}
                disabled={isLoading || isSaving}
              />
            </label>
          </div>

          <div className={styles.section}>
            <h4>Privacy Notice</h4>
            <p className={styles.notice}>
              All audio processing is done locally on your device. Transcripts are not stored permanently and are only sent to the AI API when you explicitly finish speaking.
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
              className={`${styles.button} ${styles.secondary}`}
              disabled={!apiKey || isSaving || isLoading}
            >
              Clear Key
            </button>
            <button
              onClick={handleSave}
              className={`${styles.button} ${styles.primary}`}
              disabled={isSaving || isLoading}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
