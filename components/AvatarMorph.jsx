"use client";
import { useEffect, useRef, useState } from "react";
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";
import { gsap } from "gsap";

// Adapted from React Bits "Morph Slider" (melt transition): swaps photos on a timer,
// keeps transparency, and only renders while a transition is running.

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform vec2 uCurrentFocus;
uniform vec2 uNextFocus;
uniform float uProgress;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uTime;
uniform float uReduce;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// object-fit: cover with an object-position style focal point.
vec2 coverUV(vec2 uv, vec2 res, vec2 img, vec2 focus) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5 + (focus - 0.5) * (1.0 - s);
}

vec4 sampleSplit(sampler2D tex, vec2 st, float ca) {
  vec4 base = texture2D(tex, st);
  return vec4(texture2D(tex, st + vec2(ca, 0.0)).r, base.g, texture2D(tex, st - vec2(ca, 0.0)).b, base.a);
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);
  vec2 uv = vUv;
  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    float nn = fbm(uv * uScale + uTime * 0.03);
    float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
    vec2 g = vec2(nn, warp) - 0.5;
    uvC = uv + g * uIntensity * 0.5 * p;
    uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
    m = smoothstep(nn - 0.15, nn + 0.15, p);
  }

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;
  vec4 colC = sampleSplit(tCurrent, coverUV(uvC, uResolution, uCurrentSize, uCurrentFocus), ca);
  vec4 colN = sampleSplit(tNext, coverUV(uvN, uResolution, uNextSize, uNextFocus), ca);

  gl_FragColor = mix(colC, colN, m);
}
`;

// "25% 50%" -> [0.25, 0.5] in texture space (y flipped, since GL uv.y = 1 is the top).
const parseFocus = (position = "50% 50%") => {
  const [x = "50%", y = "50%"] = position.split(/\s+/);
  return [parseFloat(x) / 100, 1 - parseFloat(y) / 100];
};

export default function AvatarMorph({
  images,
  interval = 10000,
  duration = 1.1,
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.35,
  label = "",
  className = "",
}) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  // A string key keeps the WebGL setup from re-running when the parent passes a new array with the same photos.
  const imagesKey = JSON.stringify(images.map(({ src, position }) => [src, position ?? ""]));

  useEffect(() => {
    const images = JSON.parse(imagesKey).map(([src, position]) => ({ src, position: position || undefined }));
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent || images.length === 0) return;

    let renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blank = new Texture(gl, { image: new Uint8Array(4), width: 1, height: 1, generateMipmaps: false });
    const textures = images.map(() => blank);
    const sizes = images.map(() => [1, 1]);
    const focuses = images.map((img) => parseFocus(img.position));

    const program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      uniforms: {
        tCurrent: { value: blank },
        tNext: { value: blank },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: sizes[0] },
        uNextSize: { value: sizes[0] },
        uCurrentFocus: { value: focuses[0] },
        uNextFocus: { value: focuses[0] },
        uProgress: { value: 0 },
        uIntensity: { value: intensity },
        uScale: { value: scale },
        uAberration: { value: aberration },
        uTime: { value: 0 },
        uReduce: { value: reduce ? 1 : 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const u = program.uniforms;

    let current = 0;
    let animating = false;
    let tween = null;
    let raf = 0;

    const render = () => renderer.render({ scene: mesh });

    const show = (i, slot) => {
      u[`t${slot}`].value = textures[i];
      u[`u${slot}Size`].value = sizes[i];
      u[`u${slot}Focus`].value = focuses[i];
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      u.uResolution.value = [gl.canvas.width, gl.canvas.height];
      if (!animating) render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();

    images.forEach((image, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const texture = new Texture(gl, { generateMipmaps: false, premultiplyAlpha: true });
        texture.image = img;
        textures[i] = texture;
        sizes[i] = [img.naturalWidth || 1, img.naturalHeight || 1];
        if (i === current && !animating) {
          show(i, "Current");
          render();
          setReady(true);
        }
      };
      img.src = image.src;
    });

    const next = () => {
      const target = (current + 1) % images.length;
      if (animating || images.length < 2 || textures[target] === blank) return;
      show(current, "Current");
      show(target, "Next");
      animating = true;

      const tick = (t) => {
        u.uTime.value = t * 0.001;
        render();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      tween = gsap.fromTo(
        u.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: reduce ? Math.min(duration, 0.4) : duration,
          ease: "power2.inOut",
          onComplete: () => {
            cancelAnimationFrame(raf);
            current = target;
            show(target, "Current");
            u.uProgress.value = 0;
            render();
            animating = false;
            tween = null;
          },
        },
      );
    };

    const timer = setInterval(() => {
      if (!document.hidden) next();
    }, interval);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
      tween?.kill();
      resizeObserver.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [imagesKey, interval, duration, intensity, scale, aberration]);

  const first = images[0];

  return (
    <>
      {!ready && first && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`${className} is-active`}
          src={first.src}
          alt={label}
          style={first.position ? { objectPosition: first.position } : undefined}
        />
      )}
      <canvas
        ref={canvasRef}
        className={`${className} is-active`}
        role="img"
        aria-label={label}
      />
    </>
  );
}
