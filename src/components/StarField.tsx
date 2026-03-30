import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 4000);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 2 + 1.5,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      const targetX = (mouseRef.current.x / canvas.width - 0.5) * 12;
      const targetY = (mouseRef.current.y / canvas.height - 0.5) * 8;
      offsetRef.current.x += (targetX - offsetRef.current.x) * 0.03;
      offsetRef.current.y += (targetY - offsetRef.current.y) * 0.03;

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(t * star.speed + star.phase);
        const alpha = star.opacity + twinkle * 0.3;
        const px = star.x + offsetRef.current.x * (star.size / 1.5);
        const py = star.y + offsetRef.current.y * (star.size / 1.5);

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);

        if (star.size > 1.2) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, star.size * 3);
          grd.addColorStop(0, `rgba(224, 231, 255, ${alpha})`);
          grd.addColorStop(0.5, `rgba(147, 197, 253, ${alpha * 0.4})`);
          grd.addColorStop(1, `rgba(147, 197, 253, 0)`);
          ctx.fillStyle = grd;
          ctx.arc(px, py, star.size * 3, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(224, 231, 255, ${Math.max(0.1, alpha)})`;
        }

        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="star-canvas"
      style={{ zIndex: 0 }}
    />
  );
}
