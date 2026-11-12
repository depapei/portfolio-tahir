"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { markPreloaderDone } from "@/lib/preloader-signal";

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
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);

    // --- Bintang ---
    const STAR_COUNT = 2200;
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 300 + Math.random() * 200;
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
          size: 1.3,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.85,
        }),
      ),
    );
    scene.add(stars);

    // --- Matahari di pusat ---
    scene.add(
      new THREE.Mesh(
        track(new THREE.SphereGeometry(1.1, 48, 48)),
        track(new THREE.MeshBasicMaterial({ color: 0xfff1c9 })),
      ),
    );
    const sunGlow = new THREE.Sprite(
      track(
        new THREE.SpriteMaterial({
          map: track(glowTexture("rgba(255,240,200,1)", "rgba(255,160,50,0.4)")),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        }),
      ),
    );
    sunGlow.scale.set(7, 7, 1);
    scene.add(sunGlow);

    // Cahaya memancar dari matahari ke segala arah
    scene.add(new THREE.PointLight(0xfff1dc, 3.2, 0, 0));
    scene.add(new THREE.AmbientLight(0x6688cc, 0.08));

    // --- Planet & orbit ---
    type Planet = {
      pivot: THREE.Group; // berputar mengelilingi matahari
      body: THREE.Object3D; // berputar pada porosnya
      orbitSpeed: number;
      spin: number;
    };
    const planets: Planet[] = [];
    let maxOrbit = 0;

    const addOrbitLine = (radius: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      scene.add(
        new THREE.Line(
          track(new THREE.BufferGeometry().setFromPoints(pts)),
          track(
            new THREE.LineBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.12,
            }),
          ),
        ),
      );
    };

    const addPlanet = (opts: {
      orbit: number;
      radius: number;
      material: THREE.Material;
      orbitSpeed: number;
      spin?: number;
      tilt?: number;
      extra?: (holder: THREE.Group) => void;
    }) => {
      addOrbitLine(opts.orbit);
      maxOrbit = Math.max(maxOrbit, opts.orbit + opts.radius);

      const pivot = new THREE.Group();
      pivot.rotation.y = Math.random() * Math.PI * 2; // posisi awal acak
      scene.add(pivot);

      const holder = new THREE.Group(); // kemiringan sumbu
      holder.position.x = opts.orbit;
      holder.rotation.z = THREE.MathUtils.degToRad(opts.tilt ?? 0);
      pivot.add(holder);

      const body = new THREE.Mesh(
        track(new THREE.SphereGeometry(opts.radius, 48, 48)),
        track(opts.material),
      );
      holder.add(body);
      opts.extra?.(holder);

      planets.push({
        pivot,
        body,
        orbitSpeed: opts.orbitSpeed,
        spin: opts.spin ?? 0.01,
      });
    };

    const phong = (map: THREE.Texture, shininess = 6) =>
      new THREE.MeshPhongMaterial({ map: track(map), shininess });

    // Merkurius, Venus
    addPlanet({
      orbit: 2.0,
      radius: 0.11,
      material: phong(spottedTexture("#8c8279", "#4f4842", 220, 8)),
      orbitSpeed: 0.02,
    });
    addPlanet({
      orbit: 2.8,
      radius: 0.19,
      material: phong(bandedTexture(["#e6cf9a", "#d9bd83", "#efdcb0"], 0.04)),
      orbitSpeed: 0.0145,
    });

    // Bumi: tekstur NASA + kilau laut + atmosfer + bulan
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

    const EARTH_R = 0.22;
    const atmoMat = track(
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPos;
          void main() {
            vec3 sunDir = normalize(-vWorldPos); // matahari di titik pusat
            float rim = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            float lit = 0.25 + 0.75 * max(dot(vWorldNormal, sunDir), 0.0);
            gl_FragColor = vec4(0.32, 0.62, 1.0, 1.0) * rim * lit * 1.4;
          }`,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    );
    const moonOrbit = new THREE.Group();
    const moon = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.06, 24, 24)),
      track(
        new THREE.MeshPhongMaterial({
          map: track(spottedTexture("#a3a3a3", "#5c5c5c", 260, 6)),
          shininess: 2,
        }),
      ),
    );
    moon.position.x = 0.42;
    moonOrbit.add(moon);

    addPlanet({
      orbit: 3.7,
      radius: EARTH_R,
      material: earthMat,
      orbitSpeed: 0.011,
      spin: 0.03,
      tilt: 23.4,
      extra: (holder) => {
        holder.add(
          new THREE.Mesh(track(new THREE.SphereGeometry(EARTH_R * 1.13, 48, 48)), atmoMat),
        );
        // Orbit bulan tidak ikut miring bersama sumbu bumi
        const level = new THREE.Group();
        level.rotation.z = -THREE.MathUtils.degToRad(23.4);
        level.add(moonOrbit);
        holder.add(level);
      },
    });

    // Mars
    addPlanet({
      orbit: 4.6,
      radius: 0.15,
      material: phong(spottedTexture("#b5532e", "#5e2412", 220)),
      orbitSpeed: 0.009,
      tilt: 25,
    });
    // Jupiter
    addPlanet({
      orbit: 6.2,
      radius: 0.52,
      material: phong(
        bandedTexture(["#d8b48a", "#c48a5a", "#e9d6b8", "#a9714a", "#f1e3c8"]),
      ),
      orbitSpeed: 0.005,
      spin: 0.02,
      tilt: 3,
    });
    // Saturnus + cincin
    addPlanet({
      orbit: 7.8,
      radius: 0.43,
      material: phong(bandedTexture(["#e3cf9d", "#d4b97c", "#efe0b6", "#c8ab6c"], 0.05)),
      orbitSpeed: 0.0037,
      spin: 0.018,
      tilt: 27,
      extra: (holder) => {
        const ring = new THREE.Mesh(
          track(new THREE.RingGeometry(0.6, 1.0, 96)),
          track(
            new THREE.MeshBasicMaterial({
              map: track(ringTexture()),
              side: THREE.DoubleSide,
              transparent: true,
              depthWrite: false,
            }),
          ),
        );
        ring.rotation.x = -Math.PI / 2; // sejajar ekuator planet
        holder.add(ring);
      },
    });
    // Uranus, Neptunus
    addPlanet({
      orbit: 9.1,
      radius: 0.3,
      material: phong(bandedTexture(["#9fdde3", "#8fd0d8", "#b4e8ec"], 0.03)),
      orbitSpeed: 0.0026,
      tilt: 82,
    });
    addPlanet({
      orbit: 10.3,
      radius: 0.29,
      material: phong(bandedTexture(["#3d64c9", "#4f78db", "#2f52ad", "#6a8fe6"], 0.04)),
      orbitSpeed: 0.002,
      tilt: 28,
    });

    // --- Kamera: melihat tata surya dari atas, agak miring ---
    const ELEVATION = THREE.MathUtils.degToRad(26);
    const TARGET = new THREE.Vector3(0, -0.9, 0); // geser sedikit ke atas layar
    const SCREEN_FILL = 0.7; // lebar orbit terluar ~70% lebar layar

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const fitWidth = maxOrbit / (SCREEN_FILL * t * camera.aspect);
      const fitHeight = (maxOrbit * Math.sin(ELEVATION)) / (0.42 * t);
      const d = Math.max(fitWidth, fitHeight);
      camera.position.set(
        TARGET.x,
        TARGET.y + d * Math.sin(ELEVATION),
        TARGET.z + d * Math.cos(ELEVATION),
      );
      camera.lookAt(TARGET);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const animate = () => {
      for (const p of planets) {
        p.pivot.rotation.y += p.orbitSpeed;
        p.body.rotation.y += p.spin;
      }
      moonOrbit.rotation.y += 0.05;
      stars.rotation.y += 0.0002;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
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
    <AnimatePresence onExitComplete={markPreloaderDone}>
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
