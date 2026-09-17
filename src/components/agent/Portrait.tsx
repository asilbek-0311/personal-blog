'use client';

import { useEffect, useRef } from 'react';
import { approach, pointerToLook, THINKING_LOOK, type Look } from './portrait-motion';
import styles from './portrait.module.css';

export type PortraitMood = 'idle' | 'thinking' | 'talking';

const EASE = 0.08;
const REST: Look = { x: 0, y: 0 };

/**
 * Portrait in the bold-soft style (source art: design/portrait/bold-soft-*.svg).
 * Body, hair and beard are shared; brows, eyes and mouth swap with the mood.
 * Black and white in the source become the text and page colours, so the
 * drawing follows the theme.
 */
export default function Portrait({ mood }: { mood: PortraitMood }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const moodRef = useRef(mood);
  moodRef.current = mood;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let pointer: Look = REST;
    let current: Look = REST;
    let frame = 0;

    const tick = () => {
      const target = moodRef.current === 'thinking' ? THINKING_LOOK : pointer;
      current = approach(current, target, EASE);
      svg.style.setProperty('--look-x', current.x.toFixed(4));
      svg.style.setProperty('--look-y', current.y.toFixed(4));
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      pointer = pointerToLook(event.clientX, event.clientY, svg.getBoundingClientRect());
    };
    const onLeave = () => {
      pointer = REST;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={styles.portrait}
      data-mood={mood}
      viewBox="46 68 330 380"
      role="img"
      aria-label="Drawing of Asilbek"
    >
      <g fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* ---- shoulders, overshirt, collar ---- */}
        <g className={styles.body}>
          <path
            className={styles.skin}
            d="M176 318 L174 356 C145 366 112 370 89 387 C72 401 62 422 57 442 L363 442 C357 419 349 400 331 387 C308 371 277 367 248 356 L247 318"
          />
          <path d="M174 356 L151 365 L170 402 L190 388 L211 419 L231 388 L254 402 L274 365 L248 356 C276 365 310 370 331 387 C349 400 357 419 363 442 L57 442 C62 422 72 401 89 387 C112 370 145 366 174 356 Z" />
          <path d="M174 356 Q181 378 211 405 Q239 378 248 356 M211 419 L211 440" fill="none" />
        </g>

        {/* ---- head ---- */}
        <g className={styles.head}>
          <path
            className={styles.skin}
            d="M130 200 C111 183 103 207 112 227 C117 236 124 239 132 236 M291 201 C308 184 319 207 309 228 C305 236 296 239 289 236"
          />
          <path d="M118 208 L128 213 L122 219 M304 207 L294 213 L300 219" fill="none" strokeWidth="2.5" />
          <path
            className={styles.skin}
            d="M135 153 C127 190 128 237 138 274 C146 306 165 326 188 336 C203 343 222 343 240 336 C263 326 282 305 287 274 C295 237 294 190 285 156"
          />
          <path
            stroke="none"
            d="M133 233 C139 251 144 269 159 281 C175 280 189 265 209 265 C229 264 246 278 260 280 C276 266 283 250 291 232 C290 270 285 295 270 314 C256 333 233 345 211 345 C188 345 166 332 151 313 C138 295 133 268 133 233 Z"
          />
          <path
            className={styles.hair}
            stroke="none"
            d="M130 218 C115 208 110 190 115 175 C104 158 111 134 121 119 C135 98 161 83 185 87 C200 75 217 79 227 87 C247 75 271 81 286 96 C309 117 302 140 313 157 C319 168 328 173 337 168 C333 184 320 194 306 190 C315 202 303 213 292 217 C291 201 280 187 277 169 C275 151 270 132 251 120 C240 114 232 115 227 119 C243 137 244 160 229 181 C228 160 222 143 210 135 C194 128 178 143 161 150 C144 159 149 184 143 198 C140 207 136 214 130 218 Z"
          />
          <path
            className={styles.strand}
            fill="none"
            strokeWidth="2"
            d="M127 157 C131 125 158 106 185 103 M148 151 C160 131 178 126 193 116 M244 98 C273 102 290 130 291 152 M301 171 Q312 181 323 175"
          />

          {/* ---- face: brows, eyes, nose, mouth ---- */}
          <g className={styles.face} fill="none">
            <path
              className={styles.browsIdle}
              stroke="none"
              fill="currentColor"
              d="M151 195 C162 182 181 182 189 192 C191 198 183 199 179 196 C170 192 161 193 151 195 Z M234 186 C245 174 263 176 275 187 C258 182 247 183 240 190 C235 194 230 191 234 186 Z"
            />
            <path
              className={styles.browsTalk}
              stroke="none"
              fill="currentColor"
              d="M151 195 C162 182 181 182 189 192 C191 198 183 199 179 196 C170 192 161 193 151 195 Z M234 192 C244 181 261 184 273 197 C256 193 246 194 240 197 C234 200 231 196 234 192 Z"
            />

            <g className={styles.eyes}>
              <g className={styles.eyesIdle}>
                <path d="M155 216 Q170 207 184 216 M239 215 Q253 204 268 213" />
                <ellipse cx="175" cy="220" rx="6.5" ry="9" fill="currentColor" stroke="none" />
                <ellipse cx="258" cy="217" rx="6.5" ry="9" fill="currentColor" stroke="none" />
              </g>
              <g className={styles.eyesTalk}>
                <path d="M155 216 Q170 207 184 216 M239 216 Q253 207 268 216" />
                <ellipse cx="170" cy="221" rx="6.5" ry="9" fill="currentColor" stroke="none" />
                <ellipse cx="253" cy="221" rx="6.5" ry="9" fill="currentColor" stroke="none" />
              </g>
              <g className={styles.eyesClosed}>
                <path d="M157 219 Q170 203 185 216 M239 217 Q253 204 267 220" />
              </g>
            </g>

            <path d="M210 216 C210 235 204 248 207 254 Q214 259 224 254" />

            <path className={`${styles.strand} ${styles.mouthClosed}`} d="M197 297 Q214 309 231 296" />
            <path
              className={`${styles.skin} ${styles.mouthOpen}`}
              stroke="none"
              d="M200 292 C207 286 222 288 226 297 C231 311 217 321 207 316 C199 313 195 299 200 292 Z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
