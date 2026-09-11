"use client";

import { useEffect, useRef } from "react";

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  originalColor: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  // Blinking glow effect properties
  glowState: "normal" | "glowing" | "fading";
  glowTransitionStart: number;
  glowColor: string;
  glowDuration: number;
  glowIntensity: number;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
    glowColor: string = "#d97706",
    glowDuration: number = 2000
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.originalColor = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;

    // Initialize glow effect
    this.glowState = "normal";
    this.glowTransitionStart = 0;
    this.glowColor = glowColor;
    this.glowDuration = glowDuration;
    this.glowIntensity = 0;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Interpolate between two colors based on a factor (0-1)
  interpolateColor(color1: string, color2: string, factor: number): string {
    const c1 = color1.startsWith("#") ? color1.slice(1) : color1;
    const c2 = color2.startsWith("#") ? color2.slice(1) : color2;

    const r1 = parseInt(c1.substring(0, 2), 16);
    const g1 = parseInt(c1.substring(2, 4), 16);
    const b1 = parseInt(c1.substring(4, 6), 16);

    const r2 = parseInt(c2.substring(0, 2), 16);
    const g2 = parseInt(c2.substring(2, 4), 16);
    const b2 = parseInt(c2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  updateGlowState(currentTime: number, shouldGlow: boolean, intensity: number) {
    if (shouldGlow && this.glowState === "normal") {
      this.glowState = "glowing";
      this.glowTransitionStart = currentTime;
      this.glowIntensity = intensity;
    } else if (!shouldGlow && this.glowState === "glowing") {
      this.glowState = "fading";
      this.glowTransitionStart = currentTime;
    } else if (this.glowState === "fading") {
      const elapsed = currentTime - this.glowTransitionStart;
      if (elapsed >= this.glowDuration / 2) {
        this.glowState = "normal";
      }
    }
  }

  updateColor() {
    const currentTime = performance.now();

    if (this.glowState === "glowing") {
      const elapsed = currentTime - this.glowTransitionStart;
      const progress = Math.min(elapsed / (this.glowDuration / 2), 1);

      // Fade in to glow color
      const factor = progress * this.glowIntensity;
      this.color = this.interpolateColor(
        this.originalColor,
        this.glowColor,
        factor
      );
    } else if (this.glowState === "fading") {
      const elapsed = currentTime - this.glowTransitionStart;
      const progress = Math.min(elapsed / (this.glowDuration / 2), 1);

      // Fade out from glow color
      const factor = (1 - progress) * this.glowIntensity;
      this.color = this.interpolateColor(
        this.originalColor,
        this.glowColor,
        factor
      );
    } else {
      this.color = this.originalColor;
    }
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  if (value <= min || reducedMotion) {
    return min;
  } else if (value >= max) {
    return max * throttle;
  } else {
    return value * throttle;
  }
}

interface BlinkingPixelBackgroundProps {
  gap?: number;
  speed?: number;
  colors?: string;
  opacity?: number;
  direction?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  className?: string;
  canvasClassName?: string;
  children?: React.ReactNode;
  glowColor?: string;
  glowDuration?: number;
  glowCycleDuration?: number;
  glowWidth?: number; // Width of the glow zone from each side (in pixels)
  glowMode?:
    | "alternating"
    | "simultaneous"
    | "static"
    | "center"
    | "centerBlinking"; // Animation mode for the glow effect
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeHeight?: number; // Height of the fade in pixels
}

export default function BlinkingPixelBackground({
  gap = 6,
  speed = 80,
  colors = "#111827",
  opacity = 1,
  direction = "center",
  className = "",
  canvasClassName = "",
  children,
  glowColor = "#d97706",
  glowDuration = 2000,
  glowCycleDuration = 4000,
  glowWidth = 300,
  glowMode = "alternating",
  fadeTop = false,
  fadeBottom = false,
  fadeHeight = 150,
}: BlinkingPixelBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(performance.now());
  const glowCycleStartRef = useRef(performance.now());
  const isVisibleRef = useRef(true); // Track visibility

  // Calculate responsive gap based on screen width
  const getResponsiveGap = () => {
    if (typeof window === "undefined") return gap;

    const width = window.innerWidth;
    if (width < 768) {
      // Mobile: increase gap by 50% for performance
      return Math.round(gap * 1.5);
    } else if (width < 1024) {
      // Tablet: increase gap by 20%
      return Math.round(gap * 1.2);
    }
    // Desktop: use original gap
    return gap;
  };

  useEffect(() => {
    const reducedMotionValue = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getOriginPoint = (width: number, height: number) => {
      switch (direction) {
        case "top":
          return { x: width / 2, y: 0 };
        case "bottom":
          return { x: width / 2, y: height };
        case "left":
          return { x: 0, y: height / 2 };
        case "right":
          return { x: width, y: height / 2 };
        case "top-left":
          return { x: 0, y: 0 };
        case "top-right":
          return { x: width, y: 0 };
        case "bottom-left":
          return { x: 0, y: height };
        case "bottom-right":
          return { x: width, y: height };
        case "center":
        default:
          return { x: width / 2, y: height / 2 };
      }
    };

    const initPixels = () => {
      if (!containerRef.current || !canvasRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      const ctx = canvasRef.current.getContext("2d");

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;

      const origin = getOriginPoint(width, height);
      const colorsArray = colors.split(",");
      const pxs: Pixel[] = [];

      const responsiveGap = getResponsiveGap();

      for (let x = 0; x < width; x += responsiveGap) {
        for (let y = 0; y < height; y += responsiveGap) {
          const color =
            colorsArray[Math.floor(Math.random() * colorsArray.length)];
          const dx = x - origin.x;
          const dy = y - origin.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reducedMotionValue ? 0 : distance;

          if (!ctx) return;
          pxs.push(
            new Pixel(
              canvasRef.current,
              ctx,
              x,
              y,
              color,
              getEffectiveSpeed(speed, reducedMotionValue),
              delay,
              glowColor,
              glowDuration
            )
          );
        }
      }

      pixelsRef.current = pxs;
    };

    const doAnimate = (fnName: "appear") => {
      animationRef.current = requestAnimationFrame(() => doAnimate(fnName));

      // Skip animation if not visible
      if (!isVisibleRef.current) return;

      const timeNow = performance.now();
      const timePassed = timeNow - timePreviousRef.current;
      const timeInterval = 1000 / 60;

      if (timePassed < timeInterval) return;
      timePreviousRef.current = timeNow - (timePassed % timeInterval);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Calculate glow cycle progress (0 to 1)
      const cycleElapsed = timeNow - glowCycleStartRef.current;
      const cycleProgress =
        (cycleElapsed % glowCycleDuration) / glowCycleDuration;

      // Determine which side should glow based on mode
      let leftGlowing = false;
      let rightGlowing = false;
      let centerGlowing = false;
      let centerRadiusSquared = 0; // Use squared radius to avoid sqrt

      if (glowMode === "alternating") {
        leftGlowing = cycleProgress < 0.5;
        rightGlowing = cycleProgress >= 0.5;
      } else if (glowMode === "simultaneous") {
        leftGlowing = cycleProgress < 0.5;
        rightGlowing = cycleProgress < 0.5;
      } else if (glowMode === "static") {
        leftGlowing = true;
        rightGlowing = true;
      } else if (glowMode === "center") {
        centerGlowing = true;
        const centerRadius = glowWidth * 1.5;
        centerRadiusSquared = centerRadius * centerRadius; // Pre-calculate squared
      } else if (glowMode === "centerBlinking") {
        centerGlowing = cycleProgress < 0.5;
        const centerRadius = glowWidth * 1.5;
        centerRadiusSquared = centerRadius * centerRadius;
      }

      let allIdle = true;
      for (let i = 0; i < pixelsRef.current.length; i++) {
        const pixel = pixelsRef.current[i];

        const isInLeftZone = pixel.x < glowWidth;
        const isInRightZone = pixel.x > canvasRef.current.width - glowWidth;

        let shouldGlow = false;
        let intensity = 0;

        if (centerGlowing) {
          // Center mode: calculate squared distance from center (avoid sqrt)
          const centerX = canvasRef.current.width / 2;
          const centerY = canvasRef.current.height / 2;
          const dx = pixel.x - centerX;
          const dy = pixel.y - centerY;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared <= centerRadiusSquared) {
            shouldGlow = true;
            // Calculate intensity using sqrt only when needed
            const distance = Math.sqrt(distanceSquared);
            const centerRadius = Math.sqrt(centerRadiusSquared);
            intensity = 1 - distance / centerRadius;
          }
        } else if (isInLeftZone && leftGlowing) {
          intensity = 1 - pixel.x / glowWidth;
          shouldGlow = true;
        } else if (isInRightZone && rightGlowing) {
          const distanceFromRight = canvasRef.current.width - pixel.x;
          intensity = 1 - distanceFromRight / glowWidth;
          shouldGlow = true;
        }

        pixel.updateGlowState(timeNow, shouldGlow, intensity);
        pixel.updateColor();

        pixel[fnName]();
        if (!pixel.isIdle) {
          allIdle = false;
        }
      }

      if (allIdle && animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleAnimation = (name: "appear") => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      glowCycleStartRef.current = performance.now();
      animationRef.current = requestAnimationFrame(() => doAnimate(name));
    };

    initPixels();
    handleAnimation("appear");

    // Set up Intersection Observer for performance optimization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            // Resume animation when visible
            if (animationRef.current === null) {
              glowCycleStartRef.current = performance.now();
              handleAnimation("appear");
            }
          }
          // Animation continues in requestAnimationFrame but skips rendering when not visible
        });
      },
      {
        // Start observing slightly before element enters viewport
        rootMargin: "50px",
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
    };
  }, [
    gap,
    speed,
    colors,
    direction,
    glowColor,
    glowDuration,
    glowCycleDuration,
    glowWidth,
    glowMode,
    fadeTop,
    fadeBottom,
    fadeHeight,
  ]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 pointer-events-none ${canvasClassName}`}
        style={{ opacity }}
      />

      {/* Top fade overlay */}
      {fadeTop && (
        <div
          className="absolute top-0 left-0 right-0 z-1 pointer-events-none"
          style={{
            height: `${fadeHeight}px`,
            background:
              "linear-gradient(to bottom, rgba(3, 7, 18, 1) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Bottom fade overlay */}
      {fadeBottom && (
        <div
          className="absolute bottom-0 left-0 right-0 z-1 pointer-events-none"
          style={{
            height: `${fadeHeight}px`,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(3, 7, 18, 1) 100%)",
          }}
        />
      )}

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
