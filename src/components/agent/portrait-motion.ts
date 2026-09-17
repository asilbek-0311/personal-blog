// Pointer-follow maths for the portrait. Pure, so it is easy to test.

export interface Look {
  x: number; // -1 (left) .. 1 (right)
  y: number; // -1 (up) .. 1 (down)
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** How far (in portrait widths) the pointer must be for a full look. */
const REACH = 2.5;
const SNAP = 0.001;

export const THINKING_LOOK: Look = { x: 0.6, y: -0.8 };

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export function pointerToLook(clientX: number, clientY: number, box: Box): Look {
  const size = Math.max(box.width, box.height, 1);
  const dx = clientX - (box.left + box.width / 2);
  const dy = clientY - (box.top + box.height / 2);
  return { x: clamp(dx / (size * REACH)) || 0, y: clamp(dy / (size * REACH)) || 0 };
}

/** Ease `current` toward `target`; snaps once the gap is negligible. */
export function approach(current: Look, target: Look, factor: number): Look {
  const step = (from: number, to: number) => {
    const next = from + (to - from) * factor;
    return Math.abs(to - next) < SNAP ? to : next;
  };
  return { x: step(current.x, target.x), y: step(current.y, target.y) };
}
