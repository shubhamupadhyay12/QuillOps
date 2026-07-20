"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AnimatedShaderHeroProps {
  children: ReactNode;
  className?: string;
  forceFallback?: boolean;
  forceReducedMotion?: boolean;
  variant?: "hero" | "ambient";
}

const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outputColor;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define R resolution
#define MN min(R.x, R.y)

float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(rnd(i), rnd(i + vec2(1, 0)), u.x),
             mix(rnd(i + vec2(0, 1)), rnd(i + 1.0), u.x), u.y);
}

float fbm(vec2 p) {
  float total = 0.0, amplitude = 1.0;
  mat2 transform = mat2(1.0, -0.5, 0.2, 1.2);
  for (int i = 0; i < 4; i++) {
    total += amplitude * noise(p);
    p *= 2.0 * transform;
    amplitude *= 0.5;
  }
  return total;
}

float clouds(vec2 p) {
  float depth = 1.0, total = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float amount = depth * fbm(fi * 10.0 + p.x * 0.2 + 0.2 * (1.0 + fi) * p.y + depth + fi * fi + p);
    total = mix(total, depth, amount);
    depth = amount;
    p *= 2.0 / (fi + 1.0);
  }
  return total;
}

void main() {
  vec2 uv = (FC - 0.5 * R) / MN;
  vec2 space = uv * vec2(2.0, 1.0);
  vec3 color = vec3(0.0);
  float background = clouds(vec2(space.x + time * 0.16, -space.y));
  uv *= 1.0 - 0.22 * (sin(time * 0.14) * 0.5 + 0.5);

  for (int i = 1; i < 9; i++) {
    float fi = float(i);
    uv += 0.1 * cos(fi * vec2(0.1 + 0.01 * fi, 0.8) + fi * fi + time * 0.22 + 0.1 * uv.x);
    vec2 p = uv;
    float distanceToCenter = max(length(p), 0.002);
    color += 0.0015 / distanceToCenter * (cos(sin(fi) * vec3(1.0, 2.0, 3.0)) + 1.0);
    float grain = noise(fi + p + background * 1.731);
    color += 0.002 * grain / max(length(max(p, vec2(grain * p.x * 0.02, p.y))), 0.002);
    color = mix(color, vec3(background * 0.32, background * 0.14, background * 0.035), clamp(distanceToCenter, 0.0, 1.0));
  }

  color *= vec3(1.12, 0.76, 0.42);
  outputColor = vec4(color, 1.0);
}`;

class ShaderRenderer {
  private readonly gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vertexShader: WebGLShader | null = null;
  private fragmentShader: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private resolutionUniform: WebGLUniformLocation | null = null;
  private timeUniform: WebGLUniformLocation | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });
    if (!context) throw new Error("WEBGL2_UNAVAILABLE");
    this.gl = context;
  }

  private compile(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  initialize(): boolean {
    const gl = this.gl;
    this.vertexShader = this.compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    this.fragmentShader = this.compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!this.vertexShader || !this.fragmentShader) return false;

    this.program = gl.createProgram();
    if (!this.program) return false;
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) return false;

    this.buffer = gl.createBuffer();
    if (!this.buffer) return false;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(this.program, "position");
    if (position < 0) return false;
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.resolutionUniform = gl.getUniformLocation(this.program, "resolution");
    this.timeUniform = gl.getUniformLocation(this.program, "time");
    return true;
  }

  resize(width: number, height: number, dpr: number): void {
    const pixelWidth = Math.max(1, Math.round(width * dpr));
    const pixelHeight = Math.max(1, Math.round(height * dpr));
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
      this.gl.viewport(0, 0, pixelWidth, pixelHeight);
    }
  }

  render(time: number, speed = 1): void {
    if (!this.program) return;
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.uniform2f(this.resolutionUniform, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.timeUniform, time * 0.001 * speed);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  dispose(): void {
    const gl = this.gl;
    if (this.program && this.vertexShader) gl.detachShader(this.program, this.vertexShader);
    if (this.program && this.fragmentShader) gl.detachShader(this.program, this.fragmentShader);
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.vertexShader) gl.deleteShader(this.vertexShader);
    if (this.fragmentShader) gl.deleteShader(this.fragmentShader);
    if (this.program) gl.deleteProgram(this.program);
    this.buffer = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.program = null;
  }
}

export function AnimatedShaderHero({ children, className = "", forceFallback = false, forceReducedMotion = false, variant = "hero" }: AnimatedShaderHeroProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallbackOnly, setFallbackOnly] = useState(forceFallback);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (forceFallback || !host || !canvas) return;

    let renderer: ShaderRenderer;
    try {
      renderer = new ShaderRenderer(canvas);
    } catch {
      setFallbackOnly(true);
      return;
    }
    if (!renderer.initialize()) {
      renderer.dispose();
      setFallbackOnly(true);
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    let frameId: number | null = null;
    let stopped = false;
    let lastFrame = 0;

    const isLowPowerMobile = () => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      return mobileQuery.matches && (connection?.saveData === true || (navigator.hardwareConcurrency || 8) <= 4);
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dprCap = mobileQuery.matches ? 1 : variant === "ambient" ? 1.25 : 1.5;
      renderer.resize(bounds.width, bounds.height, Math.min(window.devicePixelRatio || 1, dprCap));
      renderer.render(forceReducedMotion || motionQuery.matches || isLowPowerMobile() ? 0 : performance.now(), variant === "ambient" ? 0.38 : 1);
    };

    const loop = (now: number) => {
      if (stopped || document.hidden || forceReducedMotion || motionQuery.matches || isLowPowerMobile()) return;
      const minimumInterval = mobileQuery.matches ? 1000 / 30 : variant === "ambient" ? 1000 / 40 : 0;
      if (now - lastFrame >= minimumInterval) {
        renderer.render(now, variant === "ambient" ? 0.38 : 1);
        lastFrame = now;
      }
      frameId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      resize();
      if (!document.hidden && !forceReducedMotion && !motionQuery.matches && !isLowPowerMobile()) frameId = window.requestAnimationFrame(loop);
    };

    const onVisibilityChange = () => start();
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stopped = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      setFallbackOnly(true);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    motionQuery.addEventListener("change", start);
    mobileQuery.addEventListener("change", start);
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    start();

    return () => {
      stopped = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      observer.disconnect();
      motionQuery.removeEventListener("change", start);
      mobileQuery.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      renderer.dispose();
    };
  }, [forceFallback, forceReducedMotion, variant]);

  return (
    <div ref={hostRef} className={`q-shader-hero is-${variant} ${className}`}>
      <div className="q-shader-fallback" aria-hidden="true" />
      {!fallbackOnly && <canvas ref={canvasRef} className="q-shader-canvas" data-motion={forceReducedMotion ? "static" : "adaptive"} aria-hidden="true" />}
      <div className="q-shader-overlay" aria-hidden="true" />
      <div className="q-shader-content">{children}</div>
    </div>
  );
}
