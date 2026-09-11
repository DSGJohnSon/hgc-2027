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

  // Halo effect properties
  haloState: "normal" | "secondary" | "tertiary";
  haloTransitionStart: number;
  haloSecondaryColor: string;
  haloTertiaryColor: string;
  haloDelay: number;
  lastDistanceFactor: number; // Store the distance factor when transitioning to tertiary

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
    haloSecondaryColor: string = "#ff0000",
    haloTertiaryColor: string = "#00ff00",
    haloDelay: number = 500
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

    // Initialize halo effect
    this.haloState = "normal";
    this.haloTransitionStart = 0;
    this.haloSecondaryColor = haloSecondaryColor;
    this.haloTertiaryColor = haloTertiaryColor;
    this.haloDelay = haloDelay;
    this.lastDistanceFactor = 0;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Interpolate between two colors based on a factor (0-1)
  interpolateColor(color1: string, color2: string, factor: number): string {
    // Parse hex colors
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

  updateHaloState(
    currentTime: number,
    isMouseNear: boolean,
    currentDistanceFactor: number
  ) {
    if (this.haloState === "secondary") {
      // Store the current distance factor for use in tertiary state
      this.lastDistanceFactor = currentDistanceFactor;

      // Only transition to tertiary if mouse has left the area
      if (
        !isMouseNear &&
        currentTime - this.haloTransitionStart >= this.haloDelay
      ) {
        this.haloState = "tertiary";
        this.haloTransitionStart = currentTime;
      }
    } else if (this.haloState === "tertiary") {
      if (currentTime - this.haloTransitionStart >= this.haloDelay) {
        this.haloState = "normal";
      }
    }
  }

  activateHalo(currentTime: number, distanceFactor: number) {
    if (this.haloState === "normal") {
      this.haloState = "secondary";
      this.haloTransitionStart = currentTime;
    }
    // Keep updating the gradient while mouse is in range
    // Blend color based on distance (distanceFactor: 0 = center, 1 = edge)
    this.color = this.interpolateColor(
      this.haloSecondaryColor,
      this.originalColor,
      distanceFactor
    );
  }

  updateColor() {
    if (this.haloState === "secondary") {
      // Color is set by activateHalo with gradient
    } else if (this.haloState === "tertiary") {
      const elapsed = performance.now() - this.haloTransitionStart;
      const progress = Math.min(elapsed / this.haloDelay, 1);

      // First blend tertiary color with original based on stored distance factor
      const tertiaryWithGradient = this.interpolateColor(
        this.haloTertiaryColor,
        this.originalColor,
        this.lastDistanceFactor
      );

      // Then fade from that blended color to original over time
      this.color = this.interpolateColor(
        tertiaryWithGradient,
        this.originalColor,
        progress
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

interface PixelBackgroundProps {
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
  // Halo effect props
  haloRadius?: number;
  haloSecondaryColor?: string;
  haloTertiaryColor?: string;
  haloDelay?: number;
  // Fade effect props
  fadeBottom?: boolean;
  fadeHeight?: number; // Height of the fade in pixels
}

export default function PixelBackground({
  gap = 6,
  speed = 80,
  colors = "#fecdd3,#fda4af,#e11d48",
  opacity = 1,
  direction = "center",
  className = "",
  canvasClassName = "",
  children,
  haloRadius = 100,
  haloSecondaryColor = "#ffffff",
  haloTertiaryColor = "#cccccc",
  haloDelay = 500,
  fadeBottom = false,
  fadeHeight = 200,
}: PixelBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(performance.now());
  const mousePositionRef = useRef<{ x: number; y: number } | null>(null);

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

      for (let x = 0; x < width; x += parseInt(gap.toString(), 10)) {
        for (let y = 0; y < height; y += parseInt(gap.toString(), 10)) {
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
              haloSecondaryColor,
              haloTertiaryColor,
              haloDelay
            )
          );
        }
      }

      pixelsRef.current = pxs;
    };

    const doAnimate = (fnName: "appear") => {
      animationRef.current = requestAnimationFrame(() => doAnimate(fnName));

      const timeNow = performance.now();
      const timePassed = timeNow - timePreviousRef.current;
      const timeInterval = 1000 / 60;

      if (timePassed < timeInterval) return;
      timePreviousRef.current = timeNow - (timePassed % timeInterval);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !canvasRef.current) return;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      let allIdle = true;
      for (let i = 0; i < pixelsRef.current.length; i++) {
        const pixel = pixelsRef.current[i];

        let isMouseNear = false;
        let currentDistanceFactor = pixel.lastDistanceFactor; // Use stored value by default

        // Check if mouse is near this pixel
        if (mousePositionRef.current) {
          const dx = pixel.x - mousePositionRef.current.x;
          const dy = pixel.y - mousePositionRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= haloRadius) {
            isMouseNear = true;
            // Calculate distance factor (0 at center, 1 at edge)
            currentDistanceFactor = distance / haloRadius;
            pixel.activateHalo(timeNow, currentDistanceFactor);
          }
        }

        // Update halo state based on time and mouse proximity
        pixel.updateHaloState(timeNow, isMouseNear, currentDistanceFactor);

        // Update color based on current state
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
      animationRef.current = requestAnimationFrame(() => doAnimate(name));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = null;
    };

    initPixels();
    handleAnimation("appear");

    // Add mouse event listeners
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      // Remove mouse event listeners
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    gap,
    speed,
    colors,
    direction,
    haloRadius,
    haloSecondaryColor,
    haloTertiaryColor,
    haloDelay,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 pointer-events-none ${canvasClassName}`}
        style={{ opacity }}
      />

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
