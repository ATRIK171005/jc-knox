import { useEffect, useRef } from "react";

/**
 * The iridescent sphere, as a real WebGL shader rather than a CSS gradient.
 *
 * Written against the raw WebGL1 API on purpose: three.js + @react-three/fiber
 * pulled in ~600KB and conflicted on React 19 peers, and none of it is needed
 * to draw one full-screen quad. This is a single fragment shader.
 *
 * What it does, matching the reference site's hero object:
 *   - signed-distance circle, antialiased at the rim
 *   - the DESIGN.md gradient (255deg: yellow -> pink -> blue -> white)
 *     projected along that axis, so the palette is exactly on-brand
 *   - domain-warped fbm noise slowly churning the colour bands inside the
 *     sphere, which is what makes it read as liquid rather than printed
 *   - a soft rim falloff so it dissolves into the parchment
 *   - film grain, so it sits in the paper instead of on top of it
 *   - cursor parallax: the warp centre eases toward the pointer
 *
 * Degrades safely: if the context can't be created the component renders a
 * CSS-gradient sphere instead, so the hero is never empty.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;   // 0..1 progress through the hero
uniform float uDark;     // 1.0 if dark mode, 0.0 if light

// Light Mode Brand stops, straight from the design tokens.
const vec3 L_YELLOW = vec3(0.980, 0.796, 0.055); // #facb0e
const vec3 L_PINK   = vec3(0.941, 0.420, 0.659); // #f06ba8
const vec3 L_BLUE   = vec3(0.471, 0.729, 0.902); // #78bae6
const vec3 L_WHITE  = vec3(1.0);

// Dark Mode Brand stops (deeper/richer to adapt to dark background)
const vec3 D_YELLOW = vec3(0.980, 0.550, 0.100); 
const vec3 D_PINK   = vec3(0.750, 0.200, 0.450); 
const vec3 D_BLUE   = vec3(0.150, 0.400, 0.750); 
const vec3 D_WHITE  = vec3(0.114, 0.114, 0.114); // #1d1d1d to match dark bg

// --- value noise + fbm -----------------------------------------------------
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

// The 255deg four-stop ramp, as a function of t.
vec3 ramp(float t) {
  vec3 YELLOW = mix(L_YELLOW, D_YELLOW, uDark);
  vec3 PINK   = mix(L_PINK, D_PINK, uDark);
  vec3 BLUE   = mix(L_BLUE, D_BLUE, uDark);
  vec3 WHITE  = mix(L_WHITE, D_WHITE, uDark);

  t = clamp(t, 0.0, 1.0);
  if (t < 0.30) return mix(YELLOW, PINK, smoothstep(0.0, 0.30, t));
  if (t < 0.65) return mix(PINK,   BLUE, smoothstep(0.30, 0.65, t));
  return mix(BLUE, WHITE, smoothstep(0.65, 1.0, t));
}

void main() {
  // Normalised, aspect-corrected coords centred on the quad.
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);

  // Scroll drives the gradient the way time does — this is what makes the
  // sphere feel alive under the cursor and the wheel rather than decorative.
  float t = uTime * 0.22 + uScroll * 2.5;

  // Domain warp: noise sampling noise. This is what gives the slow,
  // liquid churn rather than a plain scrolling texture.
  vec2 drift = uMouse * 0.18;
  vec2 q = vec2(fbm(uv * 1.6 + drift + t), fbm(uv * 1.6 + vec2(3.2, 1.7) - t));
  vec2 r = vec2(
    fbm(uv * 1.9 + 3.0 * q + vec2(1.7, 9.2) + t * 1.4),
    fbm(uv * 1.9 + 3.0 * q + vec2(8.3, 2.8) - t * 1.1)
  );
  float warp = fbm(uv * 2.2 + 3.5 * r);

  // Project along the 255deg axis so the palette runs the documented way.
  // Scrolling rotates that axis slightly, so the bands sweep as you move.
  float ANG = 4.4505896 + uScroll * 0.6;  // radians(255) + scroll sweep
  vec2 axis = vec2(cos(ANG), sin(ANG));
  float grad = dot(uv, axis) * 1.05 + 0.5;

  // Warp displaces the ramp position — bands bend without leaving the palette.
  float tt = grad + warp * 0.75 + r.x * 0.2;
  vec3 col = ramp(tt);

  // Lift where the warp peaks, so highlights bloom toward white.
  vec3 CURRENT_WHITE = mix(L_WHITE, D_WHITE, uDark);
  col = mix(col, CURRENT_WHITE, smoothstep(0.35, 0.95, warp) * 0.35);

  // Sphere mask: hard-edged but antialiased, with a soft dissolve at the rim.
  float d = length(uv);
  float px = fwidth(d) * 1.5;
  float disc = 1.0 - smoothstep(0.46 - px, 0.46 + px, d);
  float rim  = 1.0 - smoothstep(0.24, 0.46, d);   // fade toward the edge
  float alpha = disc * mix(0.72, 1.0, rim);

  // Film grain — keeps it feeling printed rather than rendered.
  float g = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.035;

  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("sphere shader:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function Sphere({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = (cv.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
      cv.getContext("experimental-webgl", { alpha: true })) as WebGLRenderingContext | null;

    // No WebGL — leave the CSS gradient fallback visible and bail out.
    if (!gl) return;

    // fwidth() lives in an extension on WebGL1; without it the rim aliases.
    gl.getExtension("OES_standard_derivatives");

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(
      gl,
      gl.FRAGMENT_SHADER,
      "#extension GL_OES_standard_derivatives : enable\n" + FRAG,
    );
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("sphere link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // One full-screen triangle-pair; the shader does the rest.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uDark = gl.getUniformLocation(prog, "uDark");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Cap DPR at 2 — beyond that it's invisible cost on a laptop GPU.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, cv.width, cv.height);
    };

    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);

    // Pause only when the tab is hidden. The sphere now lives in a fixed
    // page-level layer, so it is on screen for the whole document — an
    // IntersectionObserver here would never fire and never save anything.
    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const start = performance.now();
    let frame = 0;
    let scroll = 0, scrollTarget = 0, lastStep = -1;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!visible) return;
      resize();
      // Ease the pointer so the parallax glides instead of snapping.
      mx += (tx - mx) * 0.045;
      my += (ty - my) * 0.045;
      // Progress through the WHOLE document — the sphere is a page-level
      // layer now, so tying this to the first viewport would freeze the
      // shader everywhere below the hero.
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      scrollTarget = Math.min(1, window.scrollY / max);
      scroll += (scrollTarget - scroll) * 0.08;
      // Mirror the eased value onto the element (only when it visibly
      // changes) so the scroll-reactivity is observable from tests/devtools;
      // the drawing buffer itself can't be read back after compositing.
      const step = Math.round(scroll * 100);
      if (step !== lastStep) {
        lastStep = step;
        cv.dataset.scroll = String(step);
      }
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, scroll);
      gl.uniform1f(uDark, document.documentElement.classList.contains("dark") ? 1.0 : 0.0);
      gl.uniform1f(uTime, reduced ? 0 : (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    frame = requestAnimationFrame(draw);

    // Shader is live — hide the CSS fallback underneath it.
    if (fallback.current) fallback.current.style.display = "none";

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <div className={`pointer-events-none relative ${className}`}>
      {/* CSS-gradient fallback: visible only if WebGL fails to initialise. */}
      <div
        ref={fallback}
        className="absolute inset-0 rounded-full"
        style={{ backgroundImage: "var(--gradient-iridescent-sphere)" }}
      />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
