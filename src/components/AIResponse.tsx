import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown' // Optional but highly recommended
import { useAppStore } from '../store/useAppStore'
import { writeText } from '@tauri-apps/api/clipboard'
import styles from './AIResponse.module.css'

export const AIResponse: React.FC = () => {
  const { aiResponse, aiError, isProcessing } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when a new response arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [aiResponse, isProcessing])

  const handleCopy = async () => {
    if (aiResponse) {
      await writeText(aiResponse)
      // You could add a temporary "Copied!" toast notification here
    }
  }

  return (
    <div className={`${styles.container} ${aiError ? styles.error : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>AI Assistant</h3>
        {aiResponse && !isProcessing && (
          <button className={styles.copyButton} onClick={handleCopy} title="Copy to clipboard">
            📋
          </button>
        )}
      </div>

      <div className={styles.content} ref={scrollRef}>
        {isProcessing && (
          <div className={styles.loadingContainer}>
            <div className={styles.pulseLoader} />
            <p className={styles.loadingText}>Angel is thinking...</p>
          </div>
        )}

        {!isProcessing && aiError && (
          <div className={styles.errorWrapper}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorText}>{aiError}</p>
          </div>
        )}

        {!isProcessing && aiResponse && (
          <div className={styles.markdownBody}>
            {/* Using ReactMarkdown ensures bold text and lists look correct */}
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        )}

        {!isProcessing && !aiError && !aiResponse && (
          <p className={styles.placeholder}>
            Waiting for your voice... Once you stop speaking, I'll provide insights here.
          </p>
        )}
      </div>
    </div>
  )
}

export default AIResponse