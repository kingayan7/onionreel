import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, Video, staticFile} from 'remotion';

type Beat = { t0: number; t1: number; text: string };

const defaultBeats: Beat[] = [
  { t0: 0, t1: 2, text: 'STOP scrolling SAM.gov' },
  { t0: 2, t1: 6, text: 'AI-MATCHED contracts' },
  { t0: 6, t1: 10, text: 'Only what fits you' },
  { t0: 10, t1: 15, text: 'DAILY alerts' },
  { t0: 15, t1: 20, text: 'Less noise. More shots.' },
  { t0: 20, t1: 25, text: 'FREE 7-DAY TRIAL' },
  { t0: 25, t1: 30, text: 'Start Free at MaxContrax.com' },
];

const cardStyle = {
  position: 'absolute' as const,
  left: 64,
  right: 64,
  top: 140,
  padding: '28px 28px',
  borderRadius: 22,
  background: 'rgba(11,11,11,0.55)',
  border: '1px solid rgba(255,255,255,0.10)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};

export const Reel30: React.FC<{
  title: string;
  cta: string;
  bg: string;
  fg: string;
  accent: string;
  beats?: Beat[];
  projectId: string;
  clips: { overwhelm: string; ai: string; email: string; trust: string };
}> = ({ title, cta, bg, fg, accent, beats = defaultBeats, projectId, clips }) => {
  const frame = useCurrentFrame();

  // 4x 4-second clips looped/cropped to cover 0-20s.
  const sources = [
    { from: 0, dur: 4, file: clips.overwhelm },
    { from: 4, dur: 4, file: clips.ai },
    { from: 8, dur: 4, file: clips.email },
    { from: 12, dur: 8, file: clips.trust },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {/* footage bed */}
      {sources.map((s, i) => (
        <Sequence key={i} from={Math.floor(s.from * 30)} durationInFrames={Math.floor(s.dur * 30)}>
          <Video
            src={staticFile(`clips/${projectId}/${s.file}`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* darken for readability */}
          <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} />
        </Sequence>
      ))}

      {/* beat-driven text cards */}
      {beats.map((b) => {
        const from = Math.floor(b.t0 * 30);
        const dur = Math.max(1, Math.floor((b.t1 - b.t0) * 30));
        return (
          <Sequence key={b.t0} from={from} durationInFrames={dur}>
            <BeatCard text={b.text} fg={fg} accent={accent} />
          </Sequence>
        );
      })}

      {/* End card */}
      <Sequence from={25 * 30} durationInFrames={5 * 30}>
        <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 96, fontWeight: 800, color: fg, letterSpacing: -1 }}>{title}</div>
            <div style={{ marginTop: 18, fontSize: 56, fontWeight: 800, color: accent }}>{cta}</div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(transparent 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.70) 100%)',
        }}
      />

      {/* debug frame counter (hidden) */}
      <div style={{ position: 'absolute', bottom: 10, right: 10, opacity: 0 }}>{frame}</div>
    </AbsoluteFill>
  );
};

const BeatCard: React.FC<{ text: string; fg: string; accent: string }> = ({ text, fg, accent }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 10], [18, 0], { extrapolateRight: 'clamp' });
  const o = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  const words = text.split(' ');
  const hi = (w: string) => {
    const up = w.toUpperCase();
    return up.includes('AI') || up.includes('FREE') || up.includes('TRIAL') || up.includes('SAM.GOV') || up.includes('DAILY');
  };

  return (
    <div style={{ ...cardStyle, transform: `translateY(${y}px)`, opacity: o }}>
      <div style={{ fontSize: 64, fontWeight: 900, color: fg, lineHeight: 1.05, letterSpacing: -0.8 }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: hi(w) ? accent : fg }}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};
