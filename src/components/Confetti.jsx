import React, { useEffect, useRef } from 'react';

export const Confetti = ({ active = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ConfettiParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        // Start slightly above the top
        this.y = Math.random() * -canvas.height - 20;
        this.size = Math.random() * 8 + 4;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 6 - 3;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 5 + 3; // Fall speed
        this.oscillationSpeed = Math.random() * 0.05 + 0.01;
        this.oscillationAmount = Math.random() * 4 + 2;
        this.time = Math.random() * 100;
      }

      getRandomColor() {
        const colors = [
          '#EC4899', // pink
          '#06B6D4', // cyan
          '#9333EA', // purple
          '#F59E0B', // amber
          '#10B981', // emerald
          '#3B82F6', // blue
          '#EF4444'  // red
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.time) * 0.5;
        this.rotation += this.rotationSpeed;
        this.time += this.oscillationSpeed;

        // Slow down slightly as they fall
        this.speedY *= 0.995;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        // Random shape: squares/rectangles
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    // Spawn 150 particles
    const particles = Array.from({ length: 150 }, () => new ConfettiParticle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = false;
      particles.forEach((p) => {
        p.update();
        p.draw();
        
        // Check if particles are still on screen
        if (p.y < canvas.height + 20) {
          activeParticles = true;
        }
      });

      if (activeParticles) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    // Run animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
