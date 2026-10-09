import React, { useEffect, useRef, useState } from 'react';
import { StarSystem } from '../../types/landsraad';

interface SpaceFoldParticleOverlayProps {
  currentSystem: StarSystem;
  previousSystem: StarSystem | null;
  enabled?: boolean;
  onFoldComplete?: () => void;
}

interface WarpParticle {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  baseAngle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  hue: number;
  alpha: number;
  type: 'streak' | 'spark' | 'spice_dust' | 'vortex';
}

export const SpaceFoldParticleOverlay: React.FC<SpaceFoldParticleOverlayProps> = ({
  currentSystem,
  previousSystem,
  enabled = true,
  onFoldComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number>(0);
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [foldProgress, setFoldProgress] = useState<number>(0); // 0 to 1
  const [sourceSysName, setSourceSysName] = useState<string>('');
  const [targetSysName, setTargetSysName] = useState<string>('');
  const [foldDistance, setFoldDistance] = useState<number>(0);

  const prevSysIdRef = useRef<string | null>(previousSystem ? previousSystem.id : null);

  // Trigger space fold when currentSystem changes and is different from previous
  useEffect(() => {
    if (!enabled) return;

    if (prevSysIdRef.current && prevSysIdRef.current !== currentSystem.id) {
      // Calculate distance between systems
      const prevSys = previousSystem;
      let dist = 142; // default
      if (prevSys) {
        const dx = currentSystem.coordinates[0] - prevSys.coordinates[0];
        const dy = currentSystem.coordinates[1] - prevSys.coordinates[1];
        const dz = currentSystem.coordinates[2] - prevSys.coordinates[2];
        dist = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz) * 10) / 10;
        setSourceSysName(prevSys.name);
      } else {
        setSourceSysName('Secteur Précédent');
      }

      setTargetSysName(currentSystem.name);
      setFoldDistance(dist);
      setIsFolding(true);
      setFoldProgress(0);
    }

    prevSysIdRef.current = currentSystem.id;
  }, [currentSystem, previousSystem, enabled]);

  // Particle Engine Loop
  useEffect(() => {
    if (!isFolding) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Initialize 600 warp particles
    const PARTICLE_COUNT = 650;
    const particles: WarpParticle[] = [];
    const colors = [
      '#f59e0b', // Imperial Gold
      '#fbbf24', // Amber
      '#06b6d4', // Spacing Guild Cyan
      '#38bdf8', // Light Blue
      '#ffffff', // Pure Hyperspace Light
      '#d97706', // Deep Spice
      '#fef08a'  // Solar white-yellow
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const typeRand = Math.random();
      const type: 'streak' | 'spark' | 'spice_dust' | 'vortex' = 
        typeRand < 0.65 ? 'streak' : typeRand < 0.85 ? 'vortex' : typeRand < 0.95 ? 'spark' : 'spice_dust';

      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * (Math.max(width, height) * 0.7);

      particles.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: Math.random() * 1000 + 10,
        prevZ: 1000,
        baseAngle: angle,
        radius,
        speed: 10 + Math.random() * 35,
        size: 1 + Math.random() * 2.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        hue: Math.random() * 60 + 30, // 30-90 (gold/cyan/white)
        alpha: 0.2 + Math.random() * 0.8,
        type
      });
    }

    const startTime = performance.now();
    const DURATION = 1650; // 1.65 seconds cinematic fold
    const FOCAL_LENGTH = 320;

    const render = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / DURATION);
      setFoldProgress(progress);

      const cx = width / 2;
      const cy = height / 2;

      // Clear with trail persistence for motion blur
      ctx.fillStyle = 'rgba(6, 8, 14, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Phase 1 (0 to 0.25): Spacetime Compression / Gathering
      // Phase 2 (0.25 to 0.75): Hyper-Warp Fold Burst (Hyperspace Velocity)
      // Phase 3 (0.75 to 1.0): Deceleration & Exit into Target Orbit
      let speedMultiplier = 1;
      let warpIntensity = 0;
      let vortexSpin = 0;

      if (progress < 0.25) {
        // Compression
        const t = progress / 0.25;
        speedMultiplier = 1 + t * 4;
        warpIntensity = t * 0.5;
        vortexSpin = t * 0.08;
      } else if (progress < 0.75) {
        // Peak Fold
        const t = (progress - 0.25) / 0.5;
        // Peak in middle
        const peakCurve = Math.sin(t * Math.PI);
        speedMultiplier = 5 + peakCurve * 25;
        warpIntensity = 0.5 + peakCurve * 0.5;
        vortexSpin = 0.08 + peakCurve * 0.15;
      } else {
        // Deceleration
        const t = (progress - 0.75) / 0.25;
        const decay = Math.cos((t * Math.PI) / 2);
        speedMultiplier = 1 + decay * 4;
        warpIntensity = decay * 0.4;
        vortexSpin = decay * 0.04;
      }

      // Draw expanding Holtzman Singularity Shockwaves in center
      if (progress > 0.15 && progress < 0.9) {
        const ringProgress = (progress - 0.15) / 0.75;
        const ringRadius = ringProgress * (Math.max(width, height) * 0.85);
        const ringAlpha = Math.sin(ringProgress * Math.PI) * 0.45;

        // Inner glowing core
        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.max(30, ringRadius * 0.4));
        grad.addColorStop(0, `rgba(255, 255, 255, ${ringAlpha * 0.9})`);
        grad.addColorStop(0.3, `rgba(245, 158, 11, ${ringAlpha * 0.6})`);
        grad.addColorStop(0.7, `rgba(6, 182, 212, ${ringAlpha * 0.3})`);
        grad.addColorStop(1, 'rgba(6, 8, 14, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(30, ringRadius * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // Shockwave rings
        ctx.strokeStyle = `rgba(245, 158, 11, ${ringAlpha * 0.7})`;
        ctx.lineWidth = 2.5 * (1 - ringProgress);
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary cyan pulse ring
        const secondRadius = Math.max(0, (ringProgress - 0.15) * (Math.max(width, height) * 0.8));
        if (secondRadius > 0) {
          ctx.strokeStyle = `rgba(6, 182, 212, ${ringAlpha * 0.5})`;
          ctx.lineWidth = 1.8 * (1 - ringProgress);
          ctx.beginPath();
          ctx.arc(cx, cy, secondRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Render Warp Particles & Streaks
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.prevZ = p.z;
        p.z -= p.speed * speedMultiplier;

        // Vortex rotation for particles
        if (p.type === 'vortex' || p.type === 'spice_dust') {
          p.baseAngle += vortexSpin * (100 / Math.max(30, p.z));
          p.x = Math.cos(p.baseAngle) * p.radius;
          p.y = Math.sin(p.baseAngle) * p.radius;
        }

        // Reset particle if it flies past the camera (Z <= 0)
        if (p.z <= 1) {
          p.z = 1000;
          p.prevZ = 1000;
          p.baseAngle = Math.random() * Math.PI * 2;
          p.radius = 30 + Math.random() * (Math.max(width, height) * 0.6);
          p.x = Math.cos(p.baseAngle) * p.radius;
          p.y = Math.sin(p.baseAngle) * p.radius;
        }

        // Perspective 3D to 2D projection
        const k = FOCAL_LENGTH / p.z;
        const screenX = cx + p.x * k;
        const screenY = cy + p.y * k;

        const prevK = FOCAL_LENGTH / p.prevZ;
        const prevScreenX = cx + p.x * prevK;
        const prevScreenY = cy + p.y * prevK;

        // Clip out of screen
        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
          continue;
        }

        const particleAlpha = Math.min(1, (1 - p.z / 1000) * p.alpha * (1 - Math.abs(progress - 0.5) * 0.4));
        const trailLengthFactor = Math.min(35, speedMultiplier * 1.6);

        if (p.type === 'streak' || warpIntensity > 0.4) {
          // Luminous Warp Line
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = Math.max(0.05, particleAlpha);
          ctx.lineWidth = Math.max(1, p.size * (1 - p.z / 1000) * (warpIntensity * 1.5 + 0.8));

          ctx.beginPath();
          // Extrapolate streak backwards
          const dx = screenX - prevScreenX;
          const dy = screenY - prevScreenY;
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX - dx * trailLengthFactor, screenY - dy * trailLengthFactor);
          ctx.stroke();
        } else if (p.type === 'spark') {
          // Sparkling Diamond
          ctx.fillStyle = p.color;
          ctx.globalAlpha = particleAlpha;
          const s = Math.max(1.5, p.size * (1 - p.z / 1000) * 2.2);
          ctx.fillRect(screenX - s / 2, screenY - s / 2, s, s);
        } else {
          // Floating Spice Dust Particle
          ctx.fillStyle = p.color;
          ctx.globalAlpha = particleAlpha * 0.8;
          ctx.beginPath();
          const r = Math.max(1, p.size * (1 - p.z / 1000) * 1.6);
          ctx.arc(screenX, screenY, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;

      // Draw subtle holographic Holtzman grid distortion lines
      if (warpIntensity > 0.2) {
        ctx.strokeStyle = `rgba(245, 158, 11, ${warpIntensity * 0.18})`;
        ctx.lineWidth = 1;
        const linesCount = 12;
        for (let l = 0; l < linesCount; l++) {
          const theta = (l / linesCount) * Math.PI * 2 + (time * 0.001);
          const x2 = cx + Math.cos(theta) * Math.max(width, height);
          const y2 = cy + Math.sin(theta) * Math.max(width, height);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        // Fold finished
        setIsFolding(false);
        if (onFoldComplete) onFoldComplete();
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isFolding, onFoldComplete]);

  if (!isFolding) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
      {/* 2D Canvas for High-Performance 60FPS Space-Fold Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Holographic Spacing Guild Folding Telemetry HUD Overlay */}
      <div className="absolute inset-x-0 bottom-16 sm:bottom-20 flex flex-col items-center justify-center gap-2 pointer-events-none px-4">
        <div className="bg-[#06080d]/88 backdrop-blur-xl border border-[#f59e0b]/60 px-5 py-3 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.35)] flex flex-col items-center gap-1.5 animate-pulse max-w-lg w-full">
          
          {/* Status Header */}
          <div className="flex items-center justify-between w-full font-mono text-[11px] text-[#fbbf24] tracking-widest uppercase">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
              TRANSLATION HOLTZMAN EN COURS
            </span>
            <span className="text-[#06b6d4] font-bold">
              GUILD HEIGHLINER
            </span>
          </div>

          {/* Source to Destination Route Line */}
          <div className="flex items-center justify-between w-full text-xs font-mono py-1 border-y border-[#f59e0b]/25">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-400 uppercase">Origine</span>
              <span className="text-neutral-200 font-bold">{sourceSysName || 'Secteur Local'}</span>
            </div>

            <div className="flex flex-col items-center px-3">
              <span className="text-[9px] text-[#f59e0b] font-bold">
                {foldDistance > 0 ? `${foldDistance} AL` : 'PLIAGE IMMÉDIAT'}
              </span>
              <div className="flex items-center gap-1 text-[#f59e0b]">
                <span className="text-xs">━━━━</span>
                <span className="text-xs font-bold animate-bounce">✈</span>
                <span className="text-xs">━━━━</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-neutral-400 uppercase">Destination</span>
              <span className="text-[#f59e0b] font-bold text-sm">{targetSysName}</span>
            </div>
          </div>

          {/* Progress Bar & Telemetry */}
          <div className="w-full flex flex-col gap-1 pt-0.5">
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-[#f59e0b]/30">
              <div
                className="h-full bg-gradient-to-r from-[#06b6d4] via-[#f59e0b] to-[#fef08a] transition-all duration-75 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                style={{ width: `${Math.round(foldProgress * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-neutral-400">
              <span>Mélange Guild Matrix: SYNCHRONISÉ</span>
              <span className="text-[#fbbf24] font-bold">{Math.round(foldProgress * 100)}%</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
