import {spring, interpolate, Easing} from 'remotion';
import {measureSpring} from '@remotion/animation-utils';

// Cinematic Premium motion language (v1)
// Goal: consistent easing + spring feel across all typography and transitions.

export const Motion = {
  // Smooth ease for fades/slides
  ease: Easing.bezier(0.22, 1, 0.36, 1),

  // Gentle spring (no bouncy TikTok look)
  springy: (frame: number, fps: number, opts?: {delay?: number; damping?: number; stiffness?: number}) => {
    const delay = opts?.delay ?? 0;
    return spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: {
        damping: opts?.damping ?? 24,
        stiffness: opts?.stiffness ?? 120,
        mass: 1,
      },
    });
  },

  // Premium reveal: slight rise + fade
  riseFade: (frame: number, fps: number, opts?: {fromY?: number; delay?: number; dur?: number}) => {
    const dur = opts?.dur ?? 12;
    const d = opts?.delay ?? 0;
    const t = Math.max(0, frame - d);
    const o = interpolate(t, [0, dur], [0, 1], {extrapolateRight: 'clamp', easing: Motion.ease});
    const y0 = opts?.fromY ?? 18;
    const y = interpolate(t, [0, dur], [y0, 0], {extrapolateRight: 'clamp', easing: Motion.ease});
    return {opacity: o, y};
  },

  // Helper for timing a spring to a duration
  springDurationFrames: (fps: number, config?: {damping?: number; stiffness?: number}) => {
    return Math.ceil(
      measureSpring({
        fps,
        config: {
          damping: config?.damping ?? 24,
          stiffness: config?.stiffness ?? 120,
          mass: 1,
        },
      }).durationInFrames
    );
  },
};
