import React, { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './TranscriptLog.module.css'

export const TranscriptLog: React.FC = () => {
  const { transcript, isListening } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Smoothly scroll to the bottom whenever the transcript updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [transcript])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>Live Transcript</span>
        {isListening && (
          <div className={styles.recordingIndicator}>
            <span className={styles.dot} />
            Listening
          </div>
        )}
      </div>

      <div className={styles.scrollArea} ref={scrollRef}>
        {transcript.trim() ? (
          <div className={styles.content}>
            <p className={styles.text}>{transcript}</p>
            {/* An invisible element to help anchor the scroll */}
            <div className={styles.anchor} />
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.placeholder}>
              Your spoken words will appear here in real-time...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranscriptLog