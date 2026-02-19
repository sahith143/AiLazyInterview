import React, { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import styles from './TranscriptLog.module.css'

export const TranscriptLog: React.FC = () => {
  const { transcript } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  return (
    <div className={styles.container} ref={scrollRef}>
      {transcript.trim() ? (
        <p className={styles.text}>{transcript}</p>
      ) : (
        <p className={styles.placeholder}>
          Click the microphone button or press space to start talking...
        </p>
      )}
    </div>
  )
}

export default TranscriptLog
