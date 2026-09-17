'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BASE_GRID, faceLayer, gridToRuns, SPRITE_SIZE, type Look, type SpriteMood } from './sprite';
import { AGENT_NAME } from '@/content/profile';
import styles from './agent.module.css';

const BASE_RUNS = gridToRuns(BASE_GRID);
const TALK_FRAME_MS = 140;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useBlink(enabled: boolean): boolean {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        timer = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 120);
      }, 2_500 + Math.random() * 3_000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [enabled]);
  return blink;
}

function usePointerLook(target: React.RefObject<HTMLElement | null>, enabled: boolean): Look {
  const [look, setLook] = useState<Look>({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const x: Look['x'] = Math.abs(dx) < rect.width * 0.6 ? 0 : dx < 0 ? -1 : 1;
        const y: Look['y'] = dy < -rect.height ? -1 : 0;
        setLook((prev) => (prev.x === x && prev.y === y ? prev : { x, y }));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [target, enabled]);
  return look;
}

function useMouthFrames(talking: boolean): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!talking) {
      setOpen(false);
      return;
    }
    const id = setInterval(() => setOpen((o) => !o), TALK_FRAME_MS);
    return () => clearInterval(id);
  }, [talking]);
  return open;
}

export default function PixelSprite({ mood }: { mood: SpriteMood }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const blink = useBlink(!reducedMotion);
  const pointerLook = usePointerLook(ref, !reducedMotion && mood !== 'thinking');
  const mouthOpen = useMouthFrames(mood === 'talking' && !reducedMotion);

  const face = useMemo(() => {
    const look: Look = mood === 'thinking' ? { x: 1, y: -1 } : pointerLook;
    return faceLayer({ mood, blink: blink && mood !== 'thinking', look, mouthOpen });
  }, [mood, blink, pointerLook, mouthOpen]);

  return (
    <div ref={ref} className={styles.sprite} data-mood={mood}>
      <div className={styles.spriteBody}>
        <svg
          viewBox={`0 0 ${SPRITE_SIZE} ${SPRITE_SIZE}`}
          shapeRendering="crispEdges"
          role="img"
          aria-label={`${AGENT_NAME}, a pixel koala, is ${mood}`}
        >
          {[...BASE_RUNS, ...face].map(({ x, y, w, key }) => (
            <rect key={`${key}-${x}-${y}`} x={x} y={y} width={w} height={1} className={styles[`px_${key}`]} />
          ))}
        </svg>
      </div>
      <span className={styles.shadow} aria-hidden="true" />
    </div>
  );
}
