"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const HALF = 400; // setengah sisi kubus ruang bintang
const TRAVEL_SPEED = 14; // kecepatan maju (unit / detik)
const AUTO_YAW = 0.012; // rotasi otomatis pelan (rad / detik)
const DRAG_SENS = 0.0035; // sensitivitas geser (rad / px)
const INERTIA = 0.94; // peredaman putaran setelah dilepas (per frame 60fps)
const STAR_COLORS = ["#ffffff", "#ffffff", "#cfe2ff", "#a9c8ff", "#ffe9c4", "#ffd2e6"];

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uTravel;
  uniform vec2 uShift;
  uniform float uHalf;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Posisi di ruang kamera (sudah termasuk rotasi hasil geser)
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // Maju menembus ruang + paralaks kursor, lalu bungkus di dalam kubus
    vec3 p = mv.xyz + vec3(uShift, uTravel);
    p = mod(p + uHalf, 2.0 * uHalf) - uHalf;

    float dist = length(p);
    // Pudar di tepi kubus & tepat di depan kamera supaya tidak "muncul tiba-tiba"
    float fade = smoothstep(uHalf, uHalf * 0.6, dist) * smoothstep(2.0, 18.0, -p.z);
    float twinkle = 0.65 + 0.35 * sin(uTime * (1.2 + fract(aPhase) * 2.5) + aPhase * 6.2831);

    vColor = aColor;
    vAlpha = fade * twinkle;

    gl_Position = projectionMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPixelRatio * (260.0 / max(-p.z, 1.0));
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    float core = pow(glow, 4.0);
    gl_FragColor = vec4(vColor, (glow * 0.35 + core) * vAlpha);
  }
`;

interface StarFieldProps {
  className?: string;
}

/**
 * Latar luar angkasa 3D: bintang-bintang bergerak pelan ke arah kamera,
 * bisa digeser (drag) untuk memutar ruang, dengan inersia dan paralaks kursor.
 */
export function StarField({ className }: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    // Event geser didengarkan di parent (section hero) agar konten di atasnya tetap ikut bisa di-drag
    const surface = container?.parentElement;
    if (!container || !surface) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.innerWidth < 768;
    const count = isSmall ? 2600 : 6000;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // WebGL tidak tersedia — gradien CSS tetap tampil
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, HALF * 2);

    // --- Geometri bintang ---
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * HALF;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * HALF;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * HALF;
      color.set(STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]);
      colors.set([color.r, color.g, color.b], i * 3);
      // Sebagian besar kecil, sesekali bintang besar yang terang
      const r = Math.random();
      sizes[i] = r > 0.985 ? 7 + Math.random() * 4 : r > 0.9 ? 4 + Math.random() * 2 : 1.6 + Math.random() * 2;
      phases[i] = Math.random() * 10;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const uniforms = {
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uShift: { value: new THREE.Vector2() },
      uHalf: { value: HALF },
      uPixelRatio: { value: pixelRatio },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(geometry, material);
    stars.frustumCulled = false; // posisi akhir dihitung di shader
    stars.rotation.order = "YXZ";
    scene.add(stars);

    // --- Ukuran ---
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // --- Interaksi: geser untuk memutar, kursor untuk paralaks ---
    let yaw = 0;
    let pitch = 0;
    let velYaw = 0;
    let velPitch = 0;
    let boost = 0; // dorongan kecepatan maju saat digeser cepat
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pointerId: number | null = null;
    const shiftTarget = new THREE.Vector2();
    const isInteractive = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("a, button, input, textarea, select, [role='button']");

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || isInteractive(e.target)) return;
      dragging = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = velPitch = 0;
      surface.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      shiftTarget.set(
        ((e.clientX - rect.left) / rect.width - 0.5) * -24,
        ((e.clientY - rect.top) / rect.height - 0.5) * 24,
      );
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velYaw = dx * DRAG_SENS;
      velPitch = dy * DRAG_SENS;
      yaw += velYaw;
      pitch += velPitch;
      boost = Math.min(boost + Math.hypot(dx, dy) * 0.6, 160);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      surface.style.cursor = "";
    };
    surface.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // --- Loop animasi (berhenti saat tidak terlihat) ---
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const f = dt * 60;

      if (!dragging) {
        yaw += velYaw * f;
        pitch += velPitch * f;
        const decay = Math.pow(INERTIA, f);
        velYaw *= decay;
        velPitch *= decay;
        if (!reduceMotion) yaw += AUTO_YAW * dt;
      }
      pitch = THREE.MathUtils.clamp(pitch, -1.2, 1.2);
      stars.rotation.set(pitch, yaw, 0);

      boost *= Math.pow(0.95, f);
      if (!reduceMotion) {
        uniforms.uTime.value += dt;
        uniforms.uTravel.value += (TRAVEL_SPEED + boost) * dt;
      } else {
        uniforms.uTravel.value += boost * dt;
      }
      uniforms.uShift.value.lerp(shiftTarget, 1 - Math.pow(0.93, f));

      renderer.render(scene, camera);
    };
    const start = () => {
      if (raf || !visible || document.hidden) return;
      clock.getDelta();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    renderer.render(scene, camera);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      surface.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      surface.style.cursor = "";
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}
