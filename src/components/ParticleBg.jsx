import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const ParticleBg = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Size of particle
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -Math.random() * 0.6 - 0.1; // Float upwards
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        if (isDark) {
          // Purple, Cyan, Pink neon glow
          const colors = [
            'rgba(147, 51, 234, ', // purple
            'rgba(6, 182, 212, ',  // cyan
            'rgba(236, 72, 153, '   // pink
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        } else {
          // Soft Sky Blue, Warm Pink, Soft Orange/Lavender
          const colors = [
            'rgba(14, 165, 233, ', // sky blue
            'rgba(244, 63, 94, ',  // pink
            'rgba(251, 146, 60, ', // peach orange
            'rgba(167, 139, 250, ' // lavender
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // If particle floats off top, reset to bottom
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }

        // If off sides, bounce
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      }
    }

    const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));
    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
