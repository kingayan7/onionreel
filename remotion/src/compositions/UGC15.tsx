import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export type UGC15Props = {
  ctaExact: string;
  url: string;
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

  return (
    <AbsoluteFill style={{fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system', background:'#F8FAFF'}}>
      {/* Background: red/white/blue-ish */}
      <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 18% 18%, rgba(37,99,235,0.30), rgba(37,99,235,0) 60%)'}} />
      <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 78% 20%, rgba(220,38,38,0.24), rgba(220,38,38,0) 60%)'}} />
      <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 50% 92%, rgba(15,23,42,0.14), rgba(15,23,42,0) 55%)'}} />

      {/* Logo */}
      <div style={{position:'absolute', left:54, top:40, transform:`scale(${pop(0)})`, opacity: fade(0)}}>
        <Img src={staticFile('assets/maxcontrax/logo_transparent_v2.png')} style={{height:180, width:'auto', filter:'drop-shadow(0 20px 70px rgba(0,0,0,0.18))'}} />
      </div>

      {/* UI card */}
      <div style={{position:'absolute', right:54, top:170, transform:`scale(${pop(20)})`, opacity: fade(20)}}>
        <div style={{position:'absolute', inset:-18, borderRadius:46, background:'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.40), rgba(255,255,255,0.0) 70%)', filter:'blur(14px)'}} />
        <div style={{position:'relative', width:460, borderRadius:38, overflow:'hidden', background:'#fff', border:'2px solid rgba(7,16,26,0.10)', boxShadow:'0 40px 140px rgba(0,0,0,0.18)'}}>
          <Img src={staticFile('assets/maxcontrax/ui_contract_alerts_v2.png')} style={{width:'100%', height:'auto'}} />
        </div>
      </div>

      {/* Caption card */}
      <Card x={54} y={290} w={600}>
        <div style={{fontSize:62, fontWeight:950, letterSpacing:-1.4, lineHeight:0.98, color:'#07101A', whiteSpace:'pre-wrap'}}>{active.line}</div>
        {f>=330 ? (
          <div style={{marginTop:14, fontSize:22, fontWeight:950, color:'rgba(7,16,26,0.70)'}}>{p.url}</div>
        ) : (
          <div style={{marginTop:14, fontSize:18, fontWeight:900, color:'rgba(7,16,26,0.60)'}}>Daily Contract Alerts • Match Scores • Due Dates</div>
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
