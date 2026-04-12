import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export type UGC15Props = {
  ctaExact: string;
  url: string;
  selfieVideo?: string; // public/ path
  voAudio?: string;     // public/ path
};

const Card: React.FC<{children: React.ReactNode; x: number; y: number; w: number; h?: number; r?: number; bg?: string; border?: string;}> = ({children, x, y, w, h, r=28, bg='rgba(255,255,255,0.86)', border='rgba(7,16,26,0.10)'}) => (
  <div style={{position:'absolute', left:x, top:y, width:w, height:h, borderRadius:r, background:bg, border:`2px solid ${border}`, boxShadow:'0 24px 90px rgba(0,0,0,0.18)', padding:20}}>{children}</div>
);

export const UGC15: React.FC<UGC15Props> = (p) => {
  const f = useCurrentFrame();
  const pop = (start:number) => {
    const t = Math.min(1, Math.max(0, (f-start)/10));
    return interpolate(t, [0,1], [0.96,1]);
  };
  const fade = (start:number) => {
    const t = Math.min(1, Math.max(0, (f-start)/10));
    return interpolate(t, [0,1], [0,1]);
  };

  // 15s @30fps = 450 frames
  const beats = [
    {start:0, end:60, line:'Stop searching SAM.gov\nall day.'},
    {start:60, end:180, line:'Get daily contract alerts\n(Janitorial • Security • Nurse • Cyber • Contractor).'},
    {start:180, end:330, line:'Respond faster.\nWin more.'},
    {start:330, end:450, line:p.ctaExact},
  ];

  const active = beats.find(b => f>=b.start && f<b.end) || beats[0];

  const selfie = p.selfieVideo || 'assets/maxcontrax/ugc/selfie_talk_v1.mp4';
  const vo = p.voAudio || 'assets/maxcontrax/ugc/vo_ugc15_v3.wav';

  return (
    <AbsoluteFill style={{fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system', background:'#000'}}>
      {/* VO + light music bed */}
      <Audio src={staticFile(vo)} volume={1} />
      <Audio src={staticFile('assets/maxcontrax/ugc/music_bed_v1.wav')} volume={0.18} />

      {/* Selfie video background */}
      <AbsoluteFill>
        <video
          src={staticFile(selfie)}
          style={{width:'100%', height:'100%', objectFit:'cover'}}
          muted
        />
        {/* Darken for legibility */}
        <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.55) 100%)'}} />
      </AbsoluteFill>

      {/* Logo */}
      <div style={{position:'absolute', left:44, top:36, transform:`scale(${pop(0)})`, opacity: fade(0)}}>
        <Img src={staticFile('assets/maxcontrax/logo_transparent_v2.png')} style={{height:160, width:'auto', filter:'drop-shadow(0 20px 70px rgba(0,0,0,0.45))'}} />
      </div>

      {/* UI card */}
      <div style={{position:'absolute', right:44, top:170, transform:`scale(${pop(20)})`, opacity: fade(20)}}>
        <div style={{position:'absolute', inset:-18, borderRadius:46, background:'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.40), rgba(255,255,255,0.0) 70%)', filter:'blur(14px)'}} />
        <div style={{position:'relative', width:440, borderRadius:34, overflow:'hidden', background:'#fff', border:'2px solid rgba(255,255,255,0.16)', boxShadow:'0 40px 140px rgba(0,0,0,0.45)'}}>
          <Img src={staticFile('assets/maxcontrax/ui_contract_alerts_v2.png')} style={{width:'100%', height:'auto'}} />
        </div>
      </div>

      {/* Caption card */}
      <Card x={44} y={270} w={620} bg={'rgba(255,255,255,0.90)'}>
        <div style={{fontSize:58, fontWeight:950, letterSpacing:-1.2, lineHeight:0.98, color:'#07101A', whiteSpace:'pre-wrap'}}>{active.line}</div>
        {f>=330 ? (
          <div style={{marginTop:14, fontSize:22, fontWeight:950, color:'rgba(7,16,26,0.72)'}}>{p.url}</div>
        ) : (
          <div style={{marginTop:14, fontSize:18, fontWeight:900, color:'rgba(7,16,26,0.62)'}}>Daily Contract Alerts • Match Scores • Due Dates</div>
        )}
      </Card>

      {/* Footer micro */}
      <div style={{position:'absolute', left:54, right:54, bottom:34, display:'flex', justifyContent:'space-between', color:'rgba(7,16,26,0.55)', fontSize:14, fontWeight:900}}>
        <span>15s UGC Cut</span>
        <span>MaxContrax.com</span>
      </div>
    </AbsoluteFill>
  );
};
