import React from 'react';

export const SVGLogo = ({ type = 'horizontal', className = 'h-12', isDark = true }) => {
  // Horizontal wordmark logo
  if (type === 'horizontal') {
    return (
      <svg
        viewBox="0 0 520 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="auroraGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="45%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="auroraGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.38)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.15)" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="34" fill="url(#auroraGradient)" opacity="0.25" />
        <path
          d="M 32 64 C 40 34 62 24 88 34 C 110 44 122 74 110 94 C 96 118 58 118 40 92"
          fill="none"
          stroke="url(#auroraGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="88" cy="42" r="6" fill="#fff" opacity="0.95" />

        <text
          x="140"
          y="52"
          fontFamily="'Outfit', 'Inter', sans-serif"
          fontWeight="900"
          fontSize="48"
          fill="url(#auroraGradient)"
          letterSpacing="2"
        >
          AURORA
        </text>
        <text
          x="140"
          y="90"
          fontFamily="'Outfit', 'Inter', sans-serif"
          fontWeight="800"
          fontSize="18"
          fill={isDark ? '#E5E7EB' : '#334155'}
          letterSpacing="2"
        >
          UNIVERSITY FEST PORTAL
        </text>
      </svg>
    );
  }

  // Emblem mark version
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="emblemGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      <rect x="12" y="16" width="136" height="136" rx="36" fill={isDark ? '#0B1226' : '#EFF6FF'} />
      <circle cx="80" cy="60" r="32" fill="url(#emblemGradient)" opacity="0.22" />
      <path
        d="M 54 70 C 62 48 82 40 102 48 C 118 56 126 78 116 96 C 104 118 70 120 58 96"
        fill="none"
        stroke="url(#emblemGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 45 80 C 60 60 94 56 110 74"
        fill="none"
        stroke="#EC4899"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text
        x="80"
        y="120"
        textAnchor="middle"
        fontFamily="'Outfit', 'Inter', sans-serif"
        fontWeight="800"
        fontSize="16"
        fill={isDark ? '#FFFFFF' : '#1F2937'}
        letterSpacing="1.5"
      >
        AURORA
      </text>
    </svg>
  );
};
