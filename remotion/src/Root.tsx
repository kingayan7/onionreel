import React from 'react';
import {Composition} from 'remotion';
import {Reel30} from './compositions/Reel30';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel30"
        component={Reel30}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'MaxContrax',
          cta: 'Start Free at MaxContrax.com',
          accent: '#E17B3B',
          bg: '#0B0B0B',
          fg: '#FFFFFF',
        }}
      />
    </>
  );
};
