import React from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './MicrophoneButton.module.css'

interface MicrophoneButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ onClick, disabled = false }) => {
  const { isListening, isProcessing } = useAppStore()

  const status = isProcessing ? 'processing' : isListening ? 'listening' : 'idle'

  return (
    <div className={styles.wrapper}>
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`${styles.button} ${styles[status]}`}
        title={isListening ? 'Stop recording' : 'Start recording'}
        aria-label={isListening ? 'Stop recording' : 'Start recording'}
      >
        <div className={styles.micIcon}>
          {isProcessing ? (
            <div className={styles.loader} />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </div>
        
        {isListening && <div className={styles.pulseRing} />}
      </button>

      <div className={`${styles.label} ${styles[`label_${status}`]}`}>
        {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Press to Talk'}
      </div>
    </div>
  )
}

export default MicrophoneButton