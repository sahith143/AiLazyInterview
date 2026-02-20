import React, { useState, useEffect } from 'react'
import styles from './ResumeModal.module.css'

interface ResumeModalProps {
  onClose: () => void
}

const ResumeModal: React.FC<ResumeModalProps> = ({ onClose }) => {
  const [resumeText, setResumeText] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const savedResume = localStorage.getItem('user_resume') || ''
    setResumeText(savedResume)
  }, [])

  const handleSave = () => {
    try {
      if (!resumeText.trim()) {
         localStorage.removeItem('user_resume')
      } else {
         localStorage.setItem('user_resume', resumeText)
      }
      
      setMessage({ type: 'success', text: 'Resume updated successfully!' })
      setTimeout(() => {
        setMessage(null)
        onClose()
      }, 1500)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save resume.' })
    }
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your resume?')) {
      setResumeText('')
      localStorage.removeItem('user_resume')
      setMessage({ type: 'success', text: 'Resume cleared!' })
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Resume Context</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        <div className={styles.content}>
          <p className={styles.introText}>
            Paste your resume here. The AI will use this information to provide more personalized and relevant answers during your interview.
          </p>
          
          <textarea
            className={styles.textarea}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
          />

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={handleClear} className={styles.clearBtn}>
              Clear
            </button>
            <button onClick={handleSave} className={styles.saveBtn}>
              Save Context
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeModal
