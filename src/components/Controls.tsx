import React from 'react'
import { useAppStore } from '../store/useAppStore'
import { useAiQuery } from '../hooks/useAiQuery'
import styles from './Controls.module.css'

interface ControlsProps {
  onReset: () => void
}

export const Controls: React.FC<ControlsProps> = ({ onReset }) => {
  const { transcript, isProcessing, isListening } = useAppStore()
  const { query } = useAiQuery()
  
  const hasContent = transcript.trim().length > 0

  const handleManualQuery = async () => {
    const geminiKey = import.meta.env.VITE_API_KEY_GEMINI || localStorage.getItem('api_key_gemini');
    const openaiKey = import.meta.env.VITE_API_KEY_OPENAI || localStorage.getItem('api_key_openai');
    const activeKey = geminiKey || openaiKey;

    if (activeKey && hasContent) {
      await query(transcript, activeKey);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftGroup}>
        <button
          onClick={onReset}
          disabled={!hasContent && !isProcessing}
          className={styles.resetButton}
          title="Clear everything and start fresh"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
          </svg>
          <span>New</span>
        </button>
      </div>

      <div className={styles.rightGroup}>
        {hasContent && !isListening && (
          <button
            onClick={handleManualQuery}
            disabled={isProcessing}
            className={styles.sendButton}
            title="Force AI to analyze current transcript"
          >
            {isProcessing ? (
              <span className={styles.loader} />
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                <span>Analyze</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default Controls