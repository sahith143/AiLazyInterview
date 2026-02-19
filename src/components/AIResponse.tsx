import React from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './AIResponse.module.css'

export const AIResponse: React.FC = () => {
  const { aiResponse, aiError, isProcessing } = useAppStore()

  return (
    <div className={`${styles.container} ${aiError ? styles.error : ''}`}>
      <h3 className={styles.title}>AI Response</h3>
      <div className={styles.content}>
        {isProcessing && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Processing your message...</p>
          </div>
        )}
        {!isProcessing && aiError && (
          <p className={styles.errorText}>{aiError}</p>
        )}
        {!isProcessing && aiResponse && (
          <p className={styles.responseText}>{aiResponse}</p>
        )}
        {!isProcessing && !aiError && !aiResponse && (
          <p className={styles.placeholder}>
            AI responses will appear here once you finish speaking
          </p>
        )}
      </div>
    </div>
  )
}

export default AIResponse
