// src/components/ThoughtInput.tsx
'use client';

import { useState } from 'react';
import styles from '../styles/ThoughtInput.module.css';

export default function ThoughtInput() {
  const [thought, setThought] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought }),
      });

      if (response.ok) {
        setThought('');
        setMessage('Thought sent! 💭');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('Failed to send thought');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Drop your thoughts 💭"
          className={styles.input}
          maxLength={200}
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={isSubmitting || !thought.trim()}
        >
          Send
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}