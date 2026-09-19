// WebGL engine for the profile photo morph (React Bits "Morph Slider", melt transition).
// Plain WebGL, no library. Built so nothing blocks the page: the shader links in the background,
// photos decode off the main thread, and the 1.1s transition renders at 1x resolution (the image
// is warping, so it isn't noticeable) while each settled photo is drawn once at full retina.

const vertex = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
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

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const FRAME_MS = 1000 / 60;

/**
 * Starts morphing between `images` on `canvas`; calls `onReady` once the first photo is drawn.
 * Returns a dispose function.
 */
export function createAvatarMorph(canvas, images, { interval, duration, intensity, scale, aberration }, onReady) {
  const parent = canvas.parentElement;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!parent || !gl) return () => {};

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let disposed = false;
  let raf = 0;
  let timer = 0;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram();
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const textures = images.map(() => null);
  const sizes = images.map(() => [1, 1]);
  const focuses = images.map((img) => parseFocus(img.position));
  let u = null;
  let current = 0;
  let animating = false;

  const setSize = (ratio) => {
    const rect = parent.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * ratio));
    const h = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.uResolution, w, h);
  };
  const fullRatio = () => Math.min(window.devicePixelRatio || 1, 2);

  const bind = (slot, unit, i) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, textures[i]);
    gl.uniform2f(u[`u${slot}Size`], sizes[i][0], sizes[i][1]);
    gl.uniform2f(u[`u${slot}Focus`], focuses[i][0], focuses[i][1]);
  };
  const draw = () => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const drawSettled = () => {
    setSize(fullRatio());
    bind("Current", 0, current);
    bind("Next", 1, current);
    gl.uniform1f(u.uProgress, 0);
    draw();
  };

  const upload = (img, i) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    textures[i] = texture;
    sizes[i] = [img.naturalWidth || 1, img.naturalHeight || 1];
  };

  // Decode each photo off the main thread, then upload it in its own frame.
  const load = (i) =>
    new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.src = images[i].src;
      const done = () =>
        requestAnimationFrame(() => {
          if (!disposed && img.naturalWidth) upload(img, i);
          resolve();
        });
      if (img.decode) img.decode().then(done, done);
      else img.onload = img.onerror = done;
    });

  const next = () => {
    const target = (current + 1) % images.length;
    if (animating || document.hidden || !textures[target]) return;
    animating = true;
    const length = (reduce ? Math.min(duration, 0.4) : duration) * 1000;
    let startedAt = 0;
    let lastDraw = -Infinity;

    setSize(1);
    bind("Current", 0, current);
    bind("Next", 1, target);

    const tick = (t) => {
      if (disposed) return;
      startedAt ||= t;
      const p = Math.min((t - startedAt) / length, 1);
      if (p >= 1) {
        current = target;
        drawSettled();
        animating = false;
        return;
      }
      raf = requestAnimationFrame(tick);
      // Hold to 60fps on high-refresh displays; the melt doesn't need more.
      if (t - lastDraw < FRAME_MS - 1) return;
      lastDraw = t;
      gl.uniform1f(u.uTime, t * 0.001);
      gl.uniform1f(u.uProgress, easeInOut(p));
      draw();
    };
    raf = requestAnimationFrame(tick);
  };

  const begin = async () => {
    if (disposed || !gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const names = ["tCurrent", "tNext", "uResolution", "uCurrentSize", "uNextSize", "uCurrentFocus", "uNextFocus", "uProgress", "uIntensity", "uScale", "uAberration", "uTime", "uReduce"];
    u = Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]));
    gl.uniform1i(u.tCurrent, 0);
    gl.uniform1i(u.tNext, 1);
    gl.uniform1f(u.uIntensity, intensity);
    gl.uniform1f(u.uScale, scale);
    gl.uniform1f(u.uAberration, aberration);
    gl.uniform1f(u.uReduce, reduce ? 1 : 0);
    gl.uniform1f(u.uTime, 0);

    await load(0);
    if (disposed || !textures[0]) return;
    drawSettled();
    onReady();
    for (let i = 1; i < images.length; i++) await load(i);
    if (!disposed) timer = setInterval(next, interval);
  };

  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  const waitForLink = () => {
    if (disposed) return;
    if (!parallel || gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) begin();
    else raf = requestAnimationFrame(waitForLink);
  };
  waitForLink();

  const resizeObserver = new ResizeObserver(() => {
    if (u && textures[current] && !animating) drawSettled();
  });
  resizeObserver.observe(parent);

  return () => {
    disposed = true;
    clearInterval(timer);
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    textures.forEach((t) => t && gl.deleteTexture(t));
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buffer);
  };
}
