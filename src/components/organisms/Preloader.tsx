"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

const DURATION_MS = 3_000; // durasi loading
const WORDINGS = [
  "Menyiapkan portofolio...",
  "Merangkum data & pengalaman...",
  "Sebentar ya..",
];
const WORD_MS = DURATION_MS / WORDINGS.length;
const EARTH_TEXTURE = "/images/earth.webp"; // NASA Blue Marble (public domain)

interface PreloaderProps {
  /** true selama data halaman masih dimuat */
  loading: boolean;
}

/* ------------------------------------------------------------------ */
/* Tekstur prosedural (tanpa file gambar tambahan)                     */
/* ------------------------------------------------------------------ */

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Glow bulat (untuk matahari & lens flare). */
function glowTexture(inner: string, outer: string) {
  return canvasTexture(256, 256, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.25, outer);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, w);
  });
}

/** Planet bergaris (Jupiter, Saturnus, Neptunus). */
function bandedTexture(colors: string[], noise = 0.08) {
  return canvasTexture(512, 256, (ctx, w, h) => {
    let y = 0;
    while (y < h) {
      const band = 4 + Math.random() * 18;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(0, y, w, band);
      y += band;
    }
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * noise})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 20 + Math.random() * 60, 2);
    }
  });
}

/** Planet berbintik (Mars, Bulan). */
function spottedTexture(
  base: string,
  spot: string,
  count: number,
  maxRadius = 14,
) {
  return canvasTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      const r = 1 + Math.random() * maxRadius;
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2);
      ctx.fillStyle = spot;
      ctx.globalAlpha = 0.1 + Math.random() * 0.25;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

/** Cincin Saturnus: lingkaran konsentris (cocok dengan UV planar RingGeometry). */
function ringTexture() {
  return canvasTexture(512, 512, (ctx, w) => {
    const c = w / 2;
    for (let r = c * 0.62; r < c; r += 1.5) {
      const a = 0.45 + Math.random() * 0.5;
      ctx.strokeStyle = `rgba(${200 + Math.random() * 30},${180 + Math.random() * 30},${140 + Math.random() * 30},${a})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

/** Specular map dari tekstur bumi: laut (dominan biru) memantulkan cahaya. */
function oceanSpecularMap(image: HTMLImageElement) {
  const w = 1024;
  const h = 512;
  return canvasTexture(w, h, (ctx) => {
    ctx.drawImage(image, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const water = b > r + 12 && b > g - 6 && r + g + b < 360;
      const v = water ? 255 : 18;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    ctx.putImageData(img, 0, 0);
  });
}

/* ------------------------------------------------------------------ */
/* Scene tata surya                                                    */
/* ------------------------------------------------------------------ */

function SolarScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const LOOK_Y = -0.3;

    // --- Bintang ---
    const STAR_COUNT = 2200;
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 150 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = track(new THREE.BufferGeometry());
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeo,
      track(
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.7,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.85,
        }),
      ),
    );
    scene.add(stars);

    // --- Matahari (jauh, kiri atas) ---
    const sun = new THREE.Group();
    scene.add(sun);
    sun.add(
      new THREE.Mesh(
        track(new THREE.SphereGeometry(2.2, 32, 32)),
        track(new THREE.MeshBasicMaterial({ color: 0xfff4d6 })),
      ),
    );
    const sunGlow = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: track(glowTexture("rgba(255,240,200,1)", "rgba(255,170,60,0.35)")),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        }),
      ),
    );
    sunGlow.scale.set(22, 22, 1);
    sun.add(sunGlow);

    const flareMain = track(glowTexture("rgba(255,255,255,1)", "rgba(255,200,120,0.4)"));
    const flareRing = track(glowTexture("rgba(255,220,180,0.5)", "rgba(120,160,255,0.15)"));
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(flareMain, 380, 0, new THREE.Color(0xffe6b0)));
    lensflare.addElement(new LensflareElement(flareRing, 60, 0.6));
    lensflare.addElement(new LensflareElement(flareRing, 90, 0.75));
    lensflare.addElement(new LensflareElement(flareRing, 40, 0.9));
    sun.add(lensflare);

    // Cahaya matahari + sedikit cahaya ambient supaya sisi malam tidak hitam total
    const sunLight = new THREE.DirectionalLight(0xfff1dc, 2.6);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x6688cc, 0.12));
    const sunDir = new THREE.Vector3();

    // --- Bumi (sumbu miring 23.4°) ---
    const earthTilt = new THREE.Group();
    earthTilt.rotation.z = THREE.MathUtils.degToRad(23.4);
    scene.add(earthTilt);

    const earthMat = track(
      new THREE.MeshPhongMaterial({
        shininess: 55,
        // hitam dulu: kilau baru dinyalakan setelah specular map laut siap
        specular: new THREE.Color(0x000000),
      }),
    );
    const earthTex = new THREE.TextureLoader().load(EARTH_TEXTURE, (tex) => {
      // Pantulan cahaya hanya di laut, ikut bergeser saat bumi berputar
      earthMat.specularMap = track(oceanSpecularMap(tex.image as HTMLImageElement));
      earthMat.specular.set(0x4a5d70);
      earthMat.needsUpdate = true;
    });
    track(earthTex);
    earthTex.colorSpace = THREE.SRGBColorSpace;
    earthTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    earthMat.map = earthTex;
    const earth = new THREE.Mesh(track(new THREE.SphereGeometry(1, 96, 96)), earthMat);
    earthTilt.add(earth);

    // Atmosfer: lebih terang di sisi yang menghadap matahari
    const atmoMat = track(
      new THREE.ShaderMaterial({
        uniforms: { sunDir: { value: sunDir } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 sunDir;
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          void main() {
            float rim = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            float lit = 0.35 + 0.65 * max(dot(vWorldNormal, sunDir), 0.0);
            gl_FragColor = vec4(0.32, 0.62, 1.0, 1.0) * rim * lit * 1.4;
          }`,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    );
    scene.add(new THREE.Mesh(track(new THREE.SphereGeometry(1.13, 64, 64)), atmoMat));

    // --- Bulan mengorbit bumi ---
    const moonOrbit = new THREE.Group();
    moonOrbit.rotation.x = THREE.MathUtils.degToRad(12);
    scene.add(moonOrbit);
    const moon = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.16, 32, 32)),
      track(
        new THREE.MeshPhongMaterial({
          map: track(spottedTexture("#a3a3a3", "#5c5c5c", 260, 6)),
          shininess: 2,
        }),
      ),
    );
    moon.position.set(2.15, 0, 0);
    moonOrbit.add(moon);

    // --- Planet lain di kejauhan ---
    type Planet = {
      group: THREE.Group;
      body: THREE.Mesh;
      fx: number; // posisi relatif terhadap lebar layar (-1..1)
      fy: number; // posisi relatif terhadap tinggi layar (-1..1)
      z: number;
      spin: number;
    };
    const planets: Planet[] = [];
    const addPlanet = (
      radius: number,
      map: THREE.Texture,
      fx: number,
      fy: number,
      z: number,
      spin: number,
      extra?: (g: THREE.Group) => void,
    ) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        track(new THREE.SphereGeometry(radius, 48, 48)),
        track(new THREE.MeshPhongMaterial({ map: track(map), shininess: 6 })),
      );
      group.add(body);
      extra?.(group);
      scene.add(group);
      planets.push({ group, body, fx, fy, z, spin });
    };

    // Mars
    addPlanet(0.34, spottedTexture("#b5532e", "#5e2412", 220), 0.66, -0.4, -12, 0.004);
    // Jupiter
    addPlanet(
      1.5,
      bandedTexture(["#d8b48a", "#c48a5a", "#e9d6b8", "#a9714a", "#f1e3c8"]),
      0.74,
      0.5,
      -34,
      0.008,
    );
    // Saturnus + cincin
    addPlanet(
      0.9,
      bandedTexture(["#e3cf9d", "#d4b97c", "#efe0b6", "#c8ab6c"], 0.05),
      -0.66,
      -0.46,
      -24,
      0.007,
      (g) => {
        const ring = new THREE.Mesh(
          track(new THREE.RingGeometry(1.25, 2.1, 96)),
          track(
            new THREE.MeshBasicMaterial({
              map: track(ringTexture()),
              side: THREE.DoubleSide,
              transparent: true,
              depthWrite: false,
            }),
          ),
        );
        ring.rotation.x = THREE.MathUtils.degToRad(62);
        ring.rotation.y = THREE.MathUtils.degToRad(-18);
        g.add(ring);
      },
    );
    // Neptunus (sangat jauh)
    addPlanet(
      0.9,
      bandedTexture(["#3d64c9", "#4f78db", "#2f52ad", "#6a8fe6"], 0.04),
      0.32,
      0.84,
      -60,
      0.006,
    );

    // --- Tata letak responsif ---
    const viewAt = (z: number) => {
      const d = camera.position.z - z;
      const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
      return { hw: hh * camera.aspect, hh };
    };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const fitHeight = 1.9 / Math.tan(halfFov); // diameter bumi ~52% tinggi layar
      const fitWidth = 1.6 / (Math.tan(halfFov) * camera.aspect);
      camera.position.set(0, LOOK_Y, Math.max(fitHeight, fitWidth));
      camera.lookAt(0, LOOK_Y, 0);
      camera.updateProjectionMatrix();

      // Matahari di kiri atas, jauh di belakang
      const SUN_Z = -80;
      const s = viewAt(SUN_Z);
      sun.position.set(-0.72 * s.hw, LOOK_Y + 0.62 * s.hh, SUN_Z);
      // Arah cahaya: dari arah matahari, sedikit ke depan supaya bumi tetap terlihat
      sunLight.position.set(sun.position.x, sun.position.y, Math.abs(SUN_Z) * 0.45);
      sunDir.copy(sunLight.position).normalize();

      for (const p of planets) {
        const v = viewAt(p.z);
        p.group.position.set(p.fx * v.hw, LOOK_Y + p.fy * v.hh, p.z);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const animate = () => {
      earth.rotation.y += 0.006;
      moonOrbit.rotation.y += 0.01;
      moon.rotation.y += 0.01;
      for (const p of planets) p.body.rotation.y += p.spin;
      stars.rotation.y += 0.0003;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      lensflare.dispose();
      disposables.forEach((o) => o.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */

export function Preloader({ loading }: PreloaderProps) {
  const [step, setStep] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const visible = !(timeUp && !loading);

  // Ganti wording tiap 1 detik, selesai setelah 3 detik
  useEffect(() => {
    const timers = WORDINGS.slice(1).map((_, i) =>
      setTimeout(() => setStep(i + 1), WORD_MS * (i + 1)),
    );
    timers.push(setTimeout(() => setTimeUp(true), DURATION_MS));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Kunci scroll selama preloader tampil
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label={WORDINGS[step]}
          className="fixed inset-0 z-[10000] bg-black"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
        >
          <SolarScene />

          <div className="pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-4 px-6 text-center">
            {/* Loading bar */}
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/15 md:w-64">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: DURATION_MS / 1000, ease: "linear" }}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={WORDINGS[step]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-bold tracking-widest text-white uppercase md:text-base"
              >
                {WORDINGS[step]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
