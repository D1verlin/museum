import React from 'react';

export const NoiseOverlay = () => {
  return (
    <div className="fine-art-grain" aria-hidden="true">
      <svg width="100%" height="100%">
        <filter id="aura-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.085 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aura-grain-filter)" />
      </svg>
    </div>
  );
};
