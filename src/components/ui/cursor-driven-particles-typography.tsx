"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  dispersion: number;
  returnSpd: number;

  constructor(x: number, y: number, size: number, color: string, dispersion: number, returnSpd: number) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const interactionRadius = 120;

    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const force = (interactionRadius - distance) / interactionRadius;
      this.vx -= (dx / distance) * force * this.dispersion;
      this.vy -= (dy / distance) * force * this.dispersion;
    }

    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;
    this.vx *= 0.85;
    this.vy *= 0.85;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CursorDrivenParticleTypography({
  text,
  fontSize = 120,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color,
  className,
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = color || "#FFFFFF";
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // DRAW TEXT FIRST
      ctx.fillText(text, width / 2, height / 2);

      // CAPTURE PIXELS
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];
      const step = Math.max(1, Math.floor(particleDensity * dpr));

      for (let y = 0; y < imageData.height; y += step) {
        for (let x = 0; x < imageData.width; x += step) {
          const alpha = imageData.data[(y * imageData.width + x) * 4 + 3];
          if (alpha > 128) {
            particles.push(new Particle(x / dpr, y / dpr, 1.5, color || "#FFFFFF", dispersionStrength, returnSpeed));
          }
        }
      }
      // CRITICAL: CLEAR TEXT IMMEDIATELY SO NO "UNDEFINED" OR TEXT OVERLAPS
      ctx.clearRect(0, 0, width, height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(mouseX, mouseY);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    // Use a small timeout to ensure DOM is fully painted
    const timeoutId = setTimeout(() => {
      init();
      animate();
    }, 50);

    canvas.addEventListener("mousemove", handleMove);
    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, [text, fontSize, particleDensity, dispersionStrength, returnSpeed, color]);

  return (
    <div ref={containerRef} className={cn("w-full h-full relative touch-none", className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
