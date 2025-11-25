// src/app/thoughts/page.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/ThoughtsPage.module.css';

type Thought = {
  id: number;
  text: string;
  timestamp: string;
};

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [poppedIds, setPoppedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/thoughts')
      .then(res => res.json())
      .then(data => setThoughts(data));
  }, []);

  const handlePop = (id: number) => {
    setPoppedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>Floating Thoughts 💭</h1> */}
      <div className={styles.bubbles}>
        {thoughts.map((thought, index) => (
          <div
            key={thought.id}
            className={`${styles.bubble} ${poppedIds.has(thought.id) ? styles.popped : ''}`}
            style={{
              left: `${(index * 37) % 80}%`,
              top: `${(index * 53) % 70}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${15 + (index % 5) * 2}s`,
            }}
            onClick={() => handlePop(thought.id)}
          >
            {thought.text}
          </div>
        ))}
      </div>
    </div>
  );
}