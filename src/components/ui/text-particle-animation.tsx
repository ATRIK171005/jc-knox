"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextParticleAnimationProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  resolution?: number;
  pixelSize?: number;
  hoverRadius?: number;
  repelForce?: number;
  clickRadius?: number;
  clickForce?: number;
  springForce?: number;
  friction?: number;
  theme?: "light" | "dark";
  padding?: number;
  className?: string;
  color?: string;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;

  constructor(x: number, y: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
  }

  update(mouseX: number, mouseY: number, repelForce: number, springForce: number, friction: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const interactionRadius = 60;

    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const force = (interactionRadius - distance) / interactionRadius;
      this.vx -= (dx / distance) * force * repelForce;
      this.vy -= (dy / distance) * force * repelForce;
    }

    this.vx += (this.originX - this.x) * springForce;
    this.vy += (this.originY - this.y) * springForce;
    this.vx *= friction;
    this.vy *= friction;
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

export function TextParticleAnimation({
  text,
  fontSize = 120,
  fontFamily = "sans-serif",
  fontWeight = 900,
  resolution = 4,
  pixelSize = 3,
  hoverRadius = 60,
  repelForce = 15,
  clickRadius = 300,
  clickForce = 80,
  springForce = 0.08,
  friction = 0.85,
  theme = "dark",
  padding = 150,
  className,
  color,
}: TextParticleAnimationProps) {
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
      ctx.fillStyle = color || (theme === "light" ? "#000000" : "#FFFFFF");
      ctx.font = `bold ${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      particles = [];
      const step = resolution;

      for (let y = 0; y < imageData.height; y += step) {
        for (let x = 0; x < imageData.width; x += step) {
          const alpha = imageData.data[(y * imageData.width + x) * 4 + 3];
          if (alpha > 128) {
            particles.push(new Particle(x / dpr, y / dpr, pixelSize, color || (theme === "light" ? "#000000" : "#FFFFFF")));
          }
        }
      }
      ctx.clearRect(0, 0, width, height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update(mouseX, mouseY, repelForce, springForce, friction);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleClick = () => {
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < clickRadius) {
          const force = (clickRadius - distance) / clickRadius;
          p.vx -= (dx / distance) * force * clickForce;
          p.vy -= (dy / distance) * force * clickForce;
        }
      });
    };

    init();
    animate();
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", init);
    };
  }, [text, fontSize, fontFamily, fontWeight, resolution, pixelSize, hoverRadius, repelForce, clickRadius, clickForce, springForce, friction, theme, padding, color]);

  return (
    <div ref={containerRef} className={cn("w-full h-full relative touch-none", className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
