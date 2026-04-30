import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const driftAngleRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 640;
    const isTablet = width < 1024;
    const count = isMobile ? 50 : isTablet ? 70 : 100;

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: 1 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      animFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const width = canvas.width;
      const height = canvas.height;
      const particles = particlesRef.current;

      // Update drift angle
      driftAngleRef.current += 0.001;
      const driftX = Math.cos(driftAngleRef.current) * 0.15;
      const driftY = Math.sin(driftAngleRef.current) * 0.1;

      // Update particles
      for (const p of particles) {
        // Mouse repulsion
        if (mouseRef.current) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 0) {
            const force = (200 - dist) / 200 * 0.5;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Apply drift
        p.vx += driftX * 0.01;
        p.vy += driftY * 0.01;

        // Apply velocity with damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Update pulse
        p.pulsePhase += p.pulseSpeed;
      }

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      const maxConnections = 3;
      const connectionDist = 150;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connections = 0;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= maxConnections) break;

          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.08;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const pulseGlow = Math.sin(p.pulsePhase) * 0.3 + 0.7;
        const currentAlpha = p.alpha * pulseGlow;

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
        ctx.fill();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
