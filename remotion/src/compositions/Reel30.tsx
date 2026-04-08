import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate, Video, staticFile} from 'remotion';
import {parseSrt} from '../lib/srt';
import {Motion} from '../style/motion';

type Beat = { t0: number; t1: number; text: string };

const defaultBeats: Beat[] = [
  { t0: 0, t1: 2, text: 'STOP scrolling SAM.gov' },
  { t0: 2, t1: 6, text: 'AI-MATCHED contracts for your business' },
  { t0: 6, t1: 10, text: 'Only what fits (No noise)' },
  { t0: 10, t1: 15, text: 'DAILY alerts — Personalized matches' },
  { t0: 15, t1: 20, text: 'Fewer dead ends. More real shots.' },
  { t0: 20, t1: 25, text: 'FREE 7-DAY TRIAL' },
  { t0: 25, t1: 30, text: 'Start Free at MaxContrax.com' },
];

const cardStyle = {
  position: 'absolute' as const,
  left: 64,
  right: 64,
  top: 140,
  padding: '26px 26px',
  borderRadius: 22,
  background: 'rgba(255,255,255,0.90)',
  border: '1px solid rgba(0,0,0,0.08)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
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
  const srt = staticFile(`clips/${projectId}/captions.srt`);

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
          {/* slight soften for readability (bright theme) */}
          <AbsoluteFill style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
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
        <EndCard title={title} cta={cta} bg={bg} fg={fg} accent={accent} />
      </Sequence>

      {/* captions (native Remotion render, since ffmpeg on this host lacks subtitles filter) */}
      <Captions srtPath={srt} fg={fg} accent={accent} />

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

const Captions: React.FC<{ srtPath: string; fg: string; accent: string }> = ({ srtPath, fg, accent }) => {
  const frame = useCurrentFrame();
  const [cues, setCues] = React.useState<{ startMs:number; endMs:number; text:string }[]>([]);

  React.useEffect(() => {
    fetch(srtPath)
      .then((r) => r.text())
      .then((t) => setCues(parseSrt(t)))
      .catch(() => setCues([]));
  }, [srtPath]);

  const ms = (frame / 30) * 1000;
  const cue = cues.find((c) => ms >= c.startMs && ms <= c.endMs);
  if (!cue) return null;

  const startFrame = Math.floor((cue.startMs / 1000) * 30);
  const local = Math.max(0, frame - startFrame);
  const {opacity, y} = Motion.riseFade(local, 30, { fromY: 10, dur: 10 });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', paddingBottom: 260, paddingLeft: 80, paddingRight: 80 }}>
      <div
        style={{
          transform: `translateY(${y}px)` ,
          opacity,
          fontSize: 52,
          fontWeight: 900,
          color: fg,
          lineHeight: 1.08,
          textShadow: '0 4px 14px rgba(0,0,0,0.18)',
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 18,
          padding: '18px 22px',
          maxWidth: 920,
        }}
      >
        {cue.text.split(/\n/).map((line, idx) => (
          <div key={idx}>
            {line.split(' ').map((w, i) => {
              const up = w.toUpperCase().replace(/[^A-Z0-9.]/g, '');
              const hi = ['AI','FREE','TRIAL','SAM.GOV','DAILY','MAXCONTRAX.COM'].includes(up);
              return (
                <span key={i} style={{ color: hi ? accent : fg }}>
                  {w}
                  {i < line.split(' ').length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const BeatCard: React.FC<{ text: string; fg: string; accent: string }> = ({ text, fg, accent }) => {
  const frame = useCurrentFrame();
  const {opacity: o, y} = Motion.riseFade(frame, 30, { fromY: 16, dur: 14 });

  const words = text.split(' ');
  const hi = (w: string) => {
    const up = w.toUpperCase();
    return up.includes('AI') || up.includes('FREE') || up.includes('TRIAL') || up.includes('SAM.GOV') || up.includes('DAILY') || up.includes('MATCH');
  };

  return (
    <div style={{ ...cardStyle, transform: `translateY(${y}px)`, opacity: o }}>
      <div style={{ fontSize: 62, fontWeight: 900, color: fg, lineHeight: 1.05, letterSpacing: -0.8 }}>
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
