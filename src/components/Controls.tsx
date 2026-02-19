import React from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './Controls.module.css'

interface ControlsProps {
  onReset: () => void
}

export const Controls: React.FC<ControlsProps> = ({ onReset }) => {
  const { transcript, isProcessing } = useAppStore()
  const hasContent = transcript.trim().length > 0

  return (
    <div className={styles.container}>
      <button
        onClick={onReset}
        disabled={!hasContent && !isProcessing}
        className={styles.resetButton}
        title="Clear transcript and start a new conversation"
        aria-label="New conversation"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
        </svg>
        <span>New</span>
      </button>
    </div>
  )
}

export default Controls
