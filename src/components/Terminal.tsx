// src/components/Terminal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Terminal.module.css';

type CommandHistory = {
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
};

const HELP_TEXT = `Available commands:
  help          - Show this help message
  whoami        - About me
  skills        - My technical skills
  projects      - View my projects
  articles      - Read my blog
  contact       - Get in touch
  socials       - My social links
  thought       - Add a thought to the thought bubble
  /ai           - Enter AI chat mode
  clear         - Clear terminal
  
Navigation:
  /articles     - Go to blog page
  /projects     - Go to projects page
  /thoughts     - Go to thoughts page
  /about        - Go to about page`;

const commands: Record<string, string> = {
  help: HELP_TEXT,
  whoami: 'Asilbek - Developer & Blockchain Enthusiast\nI build cool stuff and write about tech.',
  skills: 'JavaScript • TypeScript • React • Next.js\nBlockchain • Web3 • Smart Contracts',
  projects: 'Working on various blockchain and web projects.\nType "/projects" to see them all.',
  articles: 'I write about technology, blockchain, and development.\nType "/articles" to read my articles.',
  contact: 'Email: your@email.com\nFeel free to reach out!',
  socials: 'GitHub: github.com/yourusername\nLinkedIn: linkedin.com/in/yourusername',
};

export default function Terminal() {
    const [history, setHistory] = useState<CommandHistory[]>([
        { type: 'system', content: 'Welcome to Asilbek\'s Terminal!' },
        { type: 'system', content: 'Type "help" for available commands.\n' }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [aiMode, setAiMode] = useState(false);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [sessionId] = useState(() => `session-${Date.now()}`);
    const [waitingForThought, setWaitingForThought] = useState(false);


    useEffect(() => {
        if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const addToHistory = (type: CommandHistory['type'], content: string) => {
        setHistory(prev => [...prev, { type, content }]);
    };

    const handleNavigation = (path: string) => {
        addToHistory('output', `Navigating to ${path}...`);
        setTimeout(() => router.push(path), 500);
    };

    const handleThoughtCommand = async () => {
        addToHistory('output', 'Enter your thought (press Enter to submit):');
        setWaitingForThought(true);
    };


  const handleAiChat = async (message: string) => {
    setIsAiThinking(true);
    addToHistory('output', 'AI is thinking...');
  
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          sessionId // Send session ID to maintain conversation context
        }),
      });
  
      const data = await response.json();
      
      // Remove the "thinking" message
      setHistory(prev => prev.slice(0, -1));
      
      if (response.ok) {
        addToHistory('output', `AI: ${data.response}`);
      } else {
        addToHistory('error', 'AI is currently unavailable. Try again later.');
      }
    } catch {
      setHistory(prev => prev.slice(0, -1));
      addToHistory('error', 'Failed to connect to AI service.');
    } finally {
      setIsAiThinking(false);
    }
  };

  // Optional: Clear conversation when exiting AI mode
const exitAiMode = async () => {
    setAiMode(false);
    addToHistory('system', 'Exited AI mode.');
    
    // Clear the conversation history on server
    try {
      await fetch('/api/ai-chat', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Silent fail
    }
  };
  

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();

     // If waiting for thought input, save it
    if (waitingForThought) {
        setWaitingForThought(false);
        
        if (!trimmedCmd) {
        addToHistory('error', 'Thought cannot be empty.');
        return;
        }

        try {
        const response = await fetch('/api/thoughts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thought: trimmedCmd }),
        });

        if (response.ok) {
            addToHistory('output', '✓ Thought added successfully! View at /thoughts');
        } else {
            addToHistory('error', '✗ Failed to add thought.');
        }
        } catch {
        addToHistory('error', '✗ Error connecting to server.');
        }

        return;
    }

    
    if (trimmedCmd === '') return;

    // Add command to history
    addToHistory('command', trimmedCmd);

    // Handle AI mode
    if (aiMode) {
      if (trimmedCmd === '/stop' || trimmedCmd === 'exit') {
        await exitAiMode(); // Use the new function
        return;
      }
      await handleAiChat(trimmedCmd);
      return;
    }

    // Handle navigation commands
    if (trimmedCmd.startsWith('/')) {
      const route = trimmedCmd.slice(1);
      if (['articles', 'projects', 'thoughts', 'about'].includes(route)) {
        handleNavigation(`/${route}`);
        return;
      }
      
      if (trimmedCmd === '/ai') {
        setAiMode(true);
        addToHistory('system', 'Entered AI chat mode. Type your message or "/stop" to exit.');
        return;
      }
    }

    // Handle clear
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    // Handle thought command
    if (trimmedCmd === 'thought') {
      await handleThoughtCommand();
      return;
    }

    // Handle regular commands
    const output = commands[trimmedCmd.toLowerCase()];
    if (output) {
      addToHistory('output', output);
    } else {
      addToHistory('error', `Command not found: ${trimmedCmd}\nType "help" for available commands.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAiThinking) return;
    handleCommand(currentInput);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (aiMode) {
        setAiMode(false);
        setIsAiThinking(false);
        addToHistory('system', '^C\nExited AI mode.');
      } else {
        addToHistory('system', '^C');
      }
      setCurrentInput('');
    }
    
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      <div className={styles.header}>
        <div className={styles.buttons}>
          <span className={styles.close}></span>
          <span className={styles.minimize}></span>
          <span className={styles.maximize}></span>
        </div>
        <div className={styles.title}>
          {aiMode ? 'terminal - AI mode' : 'terminal'}
        </div>
      </div>
      <div className={styles.body} ref={terminalRef}>
        {history.map((item, i) => (
          <div key={i} className={styles.line}>
            {item.type === 'command' && (
              <div className={styles.commandLine}>
                <span className={styles.prompt}>
                  {aiMode ? 'ai>' : '$'}
                </span>
                <span className={styles.commandText}>{item.content}</span>
              </div>
            )}
            {item.type === 'output' && (
              <div className={styles.output}>{item.content}</div>
            )}
            {item.type === 'error' && (
              <div className={styles.error}>{item.content}</div>
            )}
            {item.type === 'system' && (
              <div className={styles.system}>{item.content}</div>
            )}
          </div>
        ))}
        <form onSubmit={handleSubmit} className={styles.inputLine}>
          <span className={styles.prompt}>
            {aiMode ? 'ai>' : '$'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={isAiThinking}
          />
          <span className={styles.cursor}>_</span>
        </form>
      </div>
    </div>
  );
}