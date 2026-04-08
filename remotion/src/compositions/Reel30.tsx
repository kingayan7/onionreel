import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, interpolate} from 'remotion';

export const Reel30: React.FC<{title: string; cta: string; bg: string; fg: string; accent: string;}> = ({
  title,
  cta,
  bg,
  fg,
  accent,
}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: bg, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{textAlign: 'center', opacity: fade}}>
        <div style={{fontSize: 96, fontWeight: 800, color: fg, letterSpacing: -1}}>{title}</div>
        <div style={{marginTop: 18, fontSize: 56, fontWeight: 700, color: accent}}>{cta}</div>
      </div>

      {/* v1 placeholder composition: end card only. Next steps add beats + clips + captions. */}
      <Sequence from={25 * 30} durationInFrames={5 * 30}>
        <AbsoluteFill style={{backgroundColor: bg, justifyContent: 'center', alignItems: 'center'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: 96, fontWeight: 800, color: fg}}>{title}</div>
            <div style={{marginTop: 18, fontSize: 56, fontWeight: 700, color: accent}}>{cta}</div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
