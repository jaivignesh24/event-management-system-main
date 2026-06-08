import React, { useState, useEffect } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    // Check if device is touch-enabled
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setMobile(isMobile);

    if (isMobile) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Elevate cursor style when hovering over buttons, inputs, links, or clickables
      const target = e.target;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' ||
        target.classList.contains('cursor-pointer');
      
      setHovered(isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (mobile) return null;

  return (
    <>
      {/* Glow Follower */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 transition-transform duration-75 -translate-x-1/2 -translate-y-1/2 border border-neonPurple mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 2 : 1})`,
          backgroundColor: hovered ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
          boxShadow: hovered ? '0 0 15px rgba(236, 72, 153, 0.6)' : 'none',
        }}
      />
      {/* Core Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 transition-all -translate-x-1/2 -translate-y-1/2 bg-neonPink mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 0.5 : 1})`,
        }}
      />
    </>
  );
};
