import React, { useRef, useEffect } from 'react';

// Lightweight tree-like branching animation on a canvas, black & white theme aware.
export default function AnimatedTree({ className = '' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let branches = [];
    let running = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function themeColor() {
      // if document has .dark class -> white lines, else black lines
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)';
    }

    function initBranches() {
      branches = [];
      const centerX = width / 2;
      const baseY = height * 0.9;
      const count = Math.max(3, Math.floor(width / 160));
      for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) * (Math.min(200, width / count));
        branches.push(createBranch(centerX + offset, baseY, -Math.PI / 2 + (Math.random() - 0.5) * 0.2, 1 + Math.random() * 0.8));
      }
    }

    function createBranch(x, y, angle, thickness) {
      return {
        x,
        y,
        angle,
        thickness,
        length: 0,
        target: 40 + Math.random() * 80,
        children: [],
        age: 0,
      };
    }

    function stepBranch(b) {
      if (b.length < b.target) {
        b.length += 0.6 + Math.random() * 0.8;
      } else if (b.children.length === 0 && Math.random() < 0.02) {
        // spawn children
        const cCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < cCount; i++) {
          const angle = b.angle + (Math.random() - 0.5) * 0.9;
          const t = b.thickness * (0.6 + Math.random() * 0.3);
          const nx = b.x + Math.cos(b.angle) * b.length;
          const ny = b.y + Math.sin(b.angle) * b.length;
          const child = createBranch(nx, ny, angle, t);
          child.target = Math.max(8, b.target * (0.4 + Math.random() * 0.6));
          b.children.push(child);
        }
      }
      b.age++;
      // step children
      b.children.forEach(stepBranch);
    }

    function drawBranch(b, ctx) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = themeColor();
      ctx.lineWidth = Math.max(0.6, b.thickness * 4);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      const nx = b.x + Math.cos(b.angle) * b.length;
      const ny = b.y + Math.sin(b.angle) * b.length;
      ctx.lineTo(nx, ny);
      ctx.stroke();
      b.children.forEach((c) => drawBranch(c, ctx));
      ctx.restore();
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // subtle vignette background for contrast
      ctx.save();
      const g = ctx.createLinearGradient(0, 0, 0, height);
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        g.addColorStop(0, 'rgba(20,20,20,0.0)');
        g.addColorStop(1, 'rgba(0,0,0,0.04)');
      } else {
        g.addColorStop(0, 'rgba(255,255,255,0.0)');
        g.addColorStop(1, 'rgba(0,0,0,0.02)');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      branches.forEach((b) => {
        stepBranch(b);
        drawBranch(b, ctx);
      });

      // occasionally reset for continuous subtle motion
      if (Math.random() < 0.002) {
        initBranches();
      }

      if (!prefersReduced) rafRef.current = requestAnimationFrame(animate);
    }

    function start() {
      resize();
      initBranches();
      if (!prefersReduced) rafRef.current = requestAnimationFrame(animate);
    }

    start();
    window.addEventListener('resize', resize);

    // observe theme changes (toggle .dark on html)
    const mo = new MutationObserver(() => {
      // redraw once to update stroke colors
      ctx.clearRect(0, 0, width, height);
      branches.forEach((b) => drawBranch(b, ctx));
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      mo.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={`animated-tree-container ${className}`} style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
