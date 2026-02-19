import React from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './MicrophoneButton.module.css'

interface MicrophoneButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ onClick, disabled = false }) => {
  const { isListening, isProcessing } = useAppStore()

  const getStatus = () => {
    if (isProcessing) return 'processing'
    if (isListening) return 'listening'
    return 'idle'
  }

  const status = getStatus()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[status]}`}
      title={isListening ? 'Stop recording' : 'Start recording'}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
    >
      <div className={styles.micIcon}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.77 2.36-2.26 0-4.29-.9-5.77-2.36M19 12c0 .55-.45 1-1 1s-1-.45-1-1c0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .55-.45 1-1 1s-1-.45-1-1c0-3.31 2.69-6 6-6s6 2.69 6 6z" />
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z" />
        </svg>
      </div>
      {isListening && <div className={styles.pulse} />}
      <div className={styles.label}>
        {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Press to Talk'}
      </div>
    </button>
  )
}

export default MicrophoneButton
