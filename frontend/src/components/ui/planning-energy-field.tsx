"use client";

import { useEffect, useRef, useState } from "react";

interface PlanningEnergyFieldProps {
  stage: string;
}

const VERTEX = `#version 300 es
precision highp float;
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
out vec4 outputColor;
uniform vec2 resolution;
uniform float time;
uniform float stage;
void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  float radius = length(p);
  float distortion = 0.035 + stage * 0.004;
  float rx = p.x * (1.0 + radius * distortion);
  float gx = p.x;
  float bx = p.x * (1.0 - radius * distortion);
  float wave = 2.4 + stage * 0.12;
  float amp = 0.23 + stage * 0.008;
  float r = 0.012 / max(abs(p.y + sin((rx + time) * wave) * amp), 0.012);
  float g = 0.008 / max(abs(p.y + sin((gx + time) * wave) * amp), 0.014);
  float b = 0.004 / max(abs(p.y + sin((bx + time) * wave) * amp), 0.016);
  float mask = smoothstep(1.05, 0.08, radius) * smoothstep(0.02, 0.45, radius);
  vec3 amber = vec3(r * 1.0, g * 0.48, b * 0.16) * mask;
  outputColor = vec4(amber, mask * 0.72);
}`;

const STAGE_INDEX: Record<string, number> = {
  queued: 0,
  routing: 1,
  researching: 2,
  synthesizing_research: 3,
  planning_outline: 4,
  validating_outline: 5,
  saving_checkpoint: 6,
  waiting_for_review: 7,
  failed: 8,
};

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function PlanningEnergyField({ stage }: PlanningEnergyFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(STAGE_INDEX[stage] ?? 0);
  const [fallback, setFallback] = useState(false);
  stageRef.current = STAGE_INDEX[stage] ?? 0;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("webgl") === "off") { setFallback(true); return; }
    const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" });
    if (!gl) { setFallback(true); return; }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!vertex || !fragment || !program || !buffer) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      setFallback(true);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      setFallback(true);
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    const stageUniform = gl.getUniformLocation(program, "stage");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let lastFrame = 0;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 ? 1 : 1.25);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      gl.useProgram(program);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reduced.matches || params.get("motion") === "reduce" ? 0 : now * 0.00022);
      gl.uniform1f(stageUniform, stageRef.current);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now: number) => {
      if (document.hidden || reduced.matches || params.get("motion") === "reduce") return;
      if (now - lastFrame >= 1000 / 30) { draw(now); lastFrame = now; }
      frame = requestAnimationFrame(loop);
    };
    const restart = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      resize();
      draw(0);
      if (!document.hidden && !reduced.matches && params.get("motion") !== "reduce") frame = requestAnimationFrame(loop);
    };
    const observer = new ResizeObserver(restart);
    observer.observe(host);
    document.addEventListener("visibilitychange", restart);
    reduced.addEventListener("change", restart);
    restart();

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", restart);
      reduced.removeEventListener("change", restart);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <div ref={hostRef} className={`planning-energy-field is-${stage}`} aria-hidden="true"><div className="planning-energy-fallback" />{fallback ? null : <canvas ref={canvasRef} />}</div>;
}
