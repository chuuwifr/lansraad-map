import React, { useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { StarSystem, TacticalPOI, ZoomLevel, MapVisualConfig, SystemPlanet, SystemStar, SystemMoon } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { getSystemPlanetsAndStars } from '../../data/systemAstronomicalData';
import { audioSynth } from '../../services/audioSynth';
import { PlanetTextureGenerator } from '../../services/planetTextureGenerator';

export interface HolosphereCanvasRef {
  rotateBy: (deltaTheta: number, deltaPhi: number) => void;
  resetRotation: () => void;
}

interface HolosphereCanvasProps {
  systems: StarSystem[];
  selectedSystem: StarSystem;
  selectedPOI: TacticalPOI | null;
  zoomLevel: ZoomLevel;
  config: MapVisualConfig;
  measuringTargetSystem: StarSystem | null;
  isMeasuringMode: boolean;
  onSelectSystem: (system: StarSystem) => void;
  onSelectPOI: (poi: TacticalPOI | null) => void;
  onZoomChange: (level: ZoomLevel) => void;
  onHoverSystem?: (system: StarSystem | null) => void;
}

export const HolosphereCanvas = React.forwardRef<HolosphereCanvasRef, HolosphereCanvasProps>(({
  systems,
  selectedSystem,
  selectedPOI,
  zoomLevel,
  config,
  measuringTargetSystem,
  isMeasuringMode,
  onSelectSystem,
  onSelectPOI,
  onZoomChange,
  onHoverSystem
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Groups
  const galacticGroupRef = useRef<THREE.Group>(new THREE.Group());
  const planetaryGroupRef = useRef<THREE.Group>(new THREE.Group());
  const systemOrbitalGroupRef = useRef<THREE.Group>(new THREE.Group());
  const fiefdomsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const guildRoutesGroupRef = useRef<THREE.Group>(new THREE.Group());
  const astrogationLineGroupRef = useRef<THREE.Group>(new THREE.Group());
  const spiceParticlesRef = useRef<THREE.Points | null>(null);
  
  // Meshes & dynamic references
  const planetMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudMeshRef = useRef<THREE.Mesh | null>(null);
  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const shieldMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const poiPinsGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Dynamic references for animated rotating planetary systems in Galactic view
  const galacticSystemsRef = useRef<{
    systemContainer: THREE.Group;
    system: StarSystem;
    starMesh: THREE.Mesh;
    starCorona?: THREE.Mesh | null;
    secondaryStarMesh?: THREE.Mesh | null;
    secondaryStarOrbitRadius?: number;
    secondaryStarOrbitSpeed?: number;
    secondaryStarAngle?: number;
    planets: {
      container: THREE.Group;
      mesh: THREE.Mesh;
      cloudsMesh?: THREE.Mesh | null;
      ringMesh?: THREE.Mesh | null;
      orbitRadius: number;
      orbitSpeed: number;
      angle: number;
      rotSpeed: number;
      isPrimary: boolean;
      moons?: {
        mesh: THREE.Mesh;
        orbitRadius: number;
        orbitSpeed: number;
        angle: number;
      }[];
    }[];
  }[]>([]);

  // Animated Stars in System view (supports single & binary star systems)
  const systemStarsRef = useRef<{
    mesh: THREE.Mesh;
    coronaMesh?: THREE.Mesh | null;
    orbitRadius: number;
    orbitSpeed: number;
    angle: number;
  }[]>([]);

  // Animated Planets in System view with their respective moons
  const systemPlanetsAnimatedRef = useRef<{
    planetContainer: THREE.Group;
    planetMesh: THREE.Mesh;
    cloudsMesh?: THREE.Mesh | null;
    ringMesh?: THREE.Mesh | null;
    orbitAngle: number;
    orbitRadius: number;
    orbitSpeed: number;
    rotSpeed: number;
    planetData: SystemPlanet;
    moons: {
      mesh: THREE.Mesh;
      orbitRadius: number;
      orbitSpeed: number;
      angle: number;
    }[];
  }[]>([]);

  const routePulsePointsRef = useRef<{
    line: THREE.Line;
    curve: THREE.QuadraticBezierCurve3;
    t: number;
    speed: number;
    pulseMesh: THREE.Mesh;
  }[]>([]);

  // Camera animation state
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 240, 520));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Parallax & Orbit controls
  const mouseParallaxRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });

  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitRotationRef = useRef<{ theta: number; phi: number }>({ theta: 0, phi: 0.35 });
  const pinchDistRef = useRef<number | null>(null);

  // Expose Imperative Handle for directional controls & rotation
  useImperativeHandle(ref, () => ({
    rotateBy: (deltaTheta: number, deltaPhi: number) => {
      orbitRotationRef.current.theta += deltaTheta;
      orbitRotationRef.current.phi = Math.max(-0.85, Math.min(1.25, orbitRotationRef.current.phi + deltaPhi));
    },
    resetRotation: () => {
      orbitRotationRef.current.theta = 0;
      orbitRotationRef.current.phi = 0.35;
    }
  }));

  // Raycaster
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseCoordsRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);
  const hoveredObjectRef = useRef<THREE.Object3D | null>(null);

  // Color scheme helper based on theme
  const getThemeColor = useCallback((type: 'primary' | 'glow' | 'ambient' | 'accent') => {
    switch (config.theme) {
      case 'spice-amber':
        return type === 'primary' ? 0xf97316 : type === 'glow' ? 0xfb923c : 0xffedd5;
      case 'mentat-cyan':
        return type === 'primary' ? 0x06b6d4 : type === 'glow' ? 0x22d3ee : 0xcffafe;
      case 'giedi-crimson':
        return type === 'primary' ? 0xdc2626 : type === 'glow' ? 0xef4444 : 0xfee2e2;
      case 'ixian-emerald':
        return type === 'primary' ? 0x10b981 : type === 'glow' ? 0x34d399 : 0xd1fae5;
      case 'night-ops-red':
        return type === 'primary' ? 0xef4444 : type === 'glow' ? 0xb91c1c : 0x7f1d1d;
      case 'imperial-gold':
      default:
        return type === 'primary' ? 0xf59e0b : type === 'glow' ? 0xfbbf24 : 0xfef3c7;
    }
  }, [config.theme]);

  // Setup Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060709, 0.0009);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 7500);
    camera.position.set(0, 240, 520);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // 4. Lights (Cinematic Directional Sun + Subtle ambient space fill)
    const ambientLight = new THREE.AmbientLight(0x242b3d, 1.6);
    scene.add(ambientLight);

    const sunIntensity = config.sunIntensity ?? 3.2;
    const dirLight = new THREE.DirectionalLight(0xfffaed, sunIntensity);
    dirLight.position.set(320, 380, 280);
    scene.add(dirLight);

    const secondaryDirLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    secondaryDirLight.position.set(-300, -200, -200);
    scene.add(secondaryDirLight);

    // 5. Spice Particles Field (Galaxy Dust & Nebulae)
    const particleCount = config.particleDensity;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const themeColor = new THREE.Color(getThemeColor('primary'));
    const spiceGold = new THREE.Color(0xf59e0b);
    const deepCyan = new THREE.Color(0x06b6d4);

    for (let i = 0; i < particleCount; i++) {
      const radius = 30 + Math.random() * 1250;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.75;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * 0.4;
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const colorRoll = Math.random();
      const mixColor = colorRoll > 0.6 
        ? themeColor.clone().lerp(spiceGold, Math.random()) 
        : themeColor.clone().lerp(deepCyan, Math.random() * 0.8);

      particleColors[i * 3] = mixColor.r;
      particleColors[i * 3 + 1] = mixColor.g;
      particleColors[i * 3 + 2] = mixColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Custom Canvas Texture for smooth circular glowing particles
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.85)');
      grad.addColorStop(0.8, 'rgba(217, 119, 6, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvasTexture);

    const particleMat = new THREE.PointsMaterial({
      size: 4.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });

    const spiceParticles = new THREE.Points(particleGeo, particleMat);
    spiceParticlesRef.current = spiceParticles;
    scene.add(spiceParticles);

    // 6. Holographic Coordinate Grid Plane
    if (config.showCoordinatesGrid) {
      const gridHelper = new THREE.GridHelper(1600, 60, getThemeColor('primary'), 0x1e293b);
      gridHelper.position.y = -85;
      (gridHelper.material as THREE.Material).transparent = true;
      (gridHelper.material as THREE.Material).opacity = 0.22;
      scene.add(gridHelper);
    }

    // Add Groups to Scene
    scene.add(galacticGroupRef.current);
    scene.add(planetaryGroupRef.current);
    scene.add(systemOrbitalGroupRef.current);
    scene.add(fiefdomsGroupRef.current);
    scene.add(guildRoutesGroupRef.current);
    scene.add(astrogationLineGroupRef.current);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [config.particleDensity, config.showCoordinatesGrid, config.sunIntensity, getThemeColor]);

  // Build Galactic Sector Elements with Authentic Planet Textures, Atmosphere Halos & Rings
  useEffect(() => {
    const galacticGroup = galacticGroupRef.current;
    const fiefdomsGroup = fiefdomsGroupRef.current;
    const guildRoutesGroup = guildRoutesGroupRef.current;
    
    // Clear previous children
    while (galacticGroup.children.length > 0) {
      galacticGroup.remove(galacticGroup.children[0]);
    }
    while (fiefdomsGroup.children.length > 0) {
      fiefdomsGroup.remove(fiefdomsGroup.children[0]);
    }
    while (guildRoutesGroup.children.length > 0) {
      guildRoutesGroup.remove(guildRoutesGroup.children[0]);
    }
    interactiveObjectsRef.current = [];
    routePulsePointsRef.current = [];
    galacticSystemsRef.current = [];

    // Filter systems based on active filter
    let visibleSystems = systems;
    if (config.activeFilter === 'spice-network') {
      visibleSystems = systems.filter(s => s.id === 'arrakis' || s.controllingHouse === 'atreides' || s.controllingHouse === 'harkonnen' || s.controllingHouse === 'guild');
    } else if (config.activeFilter === 'tech-worlds') {
      visibleSystems = systems.filter(s => s.id === 'ix' || s.id === 'richese' || s.controllingHouse === 'guild');
    } else if (config.activeFilter === 'strategic-crucial') {
      visibleSystems = systems.filter(s => s.strategicImportance === 'Crucial' || s.strategicImportance === 'Majeur');
    }

    visibleSystems.forEach((sys) => {
      const house = HOUSES_DATA[sys.controllingHouse] || HOUSES_DATA.corrino;
      const isCurrentSelected = sys.id === selectedSystem.id;
      const starColor = new THREE.Color(sys.starColor || house.color);
      const { stars, planets } = getSystemPlanetsAndStars(sys);
      const isBinary = stars.length > 1;

      // System container root node
      const systemContainer = new THREE.Group();
      systemContainer.position.set(sys.coordinates[0], sys.coordinates[1], sys.coordinates[2]);
      systemContainer.userData = { type: 'star', system: sys };

      // Inclined Ecliptic Group giving a realistic tactical 3D planetary system perspective
      const eclipticGroup = new THREE.Group();
      eclipticGroup.rotation.x = 0.36;
      eclipticGroup.rotation.z = -0.12;
      systemContainer.add(eclipticGroup);

      // 1. Central Host Star / Sun (Étoile Centrale)
      const primaryStarRadius = sys.strategicImportance === 'Crucial' ? 3.8 : (sys.isCustom ? 3.4 : 3.0);
      const starGeo = new THREE.SphereGeometry(primaryStarRadius, 24, 24);
      const starMat = new THREE.MeshStandardMaterial({
        color: starColor,
        emissive: starColor,
        emissiveIntensity: isCurrentSelected ? 2.5 : 1.7,
        roughness: 0.12
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.userData = { type: 'star', system: sys, isSun: true };
      eclipticGroup.add(starMesh);
      interactiveObjectsRef.current.push(starMesh);

      // Star Stellar Corona Ring
      const coronaGeo = new THREE.RingGeometry(primaryStarRadius * 1.25, primaryStarRadius * 2.2, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: starColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isCurrentSelected ? 0.75 : 0.38
      });
      const starCorona = new THREE.Mesh(coronaGeo, coronaMat);
      starCorona.rotation.x = Math.PI / 2;
      starMesh.add(starCorona);

      // Star Atmosphere Radiant Glow Aura
      const starAuraGeo = new THREE.SphereGeometry(primaryStarRadius * 1.45, 18, 18);
      const starAuraMat = new THREE.MeshBasicMaterial({
        color: starColor,
        transparent: true,
        opacity: isCurrentSelected ? 0.32 : 0.18,
        side: THREE.BackSide
      });
      const starAura = new THREE.Mesh(starAuraGeo, starAuraMat);
      starMesh.add(starAura);

      // Binary companion star if present (e.g. Poritrin, Ix)
      let secondaryStarMesh: THREE.Mesh | null = null;
      let secondaryStarOrbitRadius = 0;
      let secondaryStarOrbitSpeed = 0;
      let secondaryStarAngle = 0;

      if (isBinary) {
        const companionData = stars[1];
        const compColor = new THREE.Color(companionData.color || '#fef08a');
        const compRadius = primaryStarRadius * 0.55;
        const compGeo = new THREE.SphereGeometry(compRadius, 16, 16);
        const compMat = new THREE.MeshStandardMaterial({
          color: compColor,
          emissive: compColor,
          emissiveIntensity: 1.8,
          roughness: 0.15
        });
        secondaryStarMesh = new THREE.Mesh(compGeo, compMat);
        secondaryStarOrbitRadius = primaryStarRadius * 1.85;
        secondaryStarOrbitSpeed = 0.008;
        secondaryStarAngle = Math.PI;
        secondaryStarMesh.position.set(Math.cos(secondaryStarAngle) * secondaryStarOrbitRadius, 0, Math.sin(secondaryStarAngle) * secondaryStarOrbitRadius);
        secondaryStarMesh.userData = { type: 'star', system: sys, isSun: true };
        eclipticGroup.add(secondaryStarMesh);
        interactiveObjectsRef.current.push(secondaryStarMesh);
      }

      // 2. Concentric Planetary Orbits & Sequential Orbiting Worlds
      const orbitCount = planets.length;
      const baseOrbitRadius = primaryStarRadius + 4.5;
      const orbitStep = 4.6;
      const maxOrbitRadius = baseOrbitRadius + ((orbitCount - 1) * orbitStep);

      // System Ecliptic Disc / Habitable Zone Disc
      const eclipticDiscGeo = new THREE.RingGeometry(primaryStarRadius * 1.15, maxOrbitRadius + 3.0, 36);
      const eclipticDiscMat = new THREE.MeshBasicMaterial({
        color: starColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isCurrentSelected ? 0.12 : 0.04
      });
      const eclipticDisc = new THREE.Mesh(eclipticDiscGeo, eclipticDiscMat);
      eclipticDisc.rotation.x = Math.PI / 2;
      eclipticGroup.add(eclipticDisc);

      const animatedPlanetsList: {
        container: THREE.Group;
        mesh: THREE.Mesh;
        cloudsMesh?: THREE.Mesh | null;
        ringMesh?: THREE.Mesh | null;
        orbitRadius: number;
        orbitSpeed: number;
        angle: number;
        rotSpeed: number;
        isPrimary: boolean;
        moons?: {
          mesh: THREE.Mesh;
          orbitRadius: number;
          orbitSpeed: number;
          angle: number;
        }[];
      }[] = [];

      planets.forEach((p, pIdx) => {
        const pOrbitRadius = baseOrbitRadius + (pIdx * orbitStep);
        const isPrimaryPlanet = p.isPrimary;

        // Orbit Track Line in Ecliptic Plane
        const orbitPathGeo = new THREE.BufferGeometry();
        const pts: number[] = [];
        const segments = 48;
        for (let j = 0; j <= segments; j++) {
          const a = (j / segments) * Math.PI * 2;
          pts.push(Math.cos(a) * pOrbitRadius, 0, Math.sin(a) * pOrbitRadius);
        }
        orbitPathGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const orbitMat = new THREE.LineBasicMaterial({
          color: isPrimaryPlanet ? 0xf59e0b : starColor,
          transparent: true,
          opacity: isPrimaryPlanet ? (isCurrentSelected ? 0.65 : 0.42) : (isCurrentSelected ? 0.32 : 0.16)
        });
        const orbitLine = new THREE.Line(orbitPathGeo, orbitMat);
        eclipticGroup.add(orbitLine);

        // Planet Container
        const pContainer = new THREE.Group();
        const initialAngle = (pIdx * (Math.PI * 2 / Math.max(1, orbitCount))) + ((sys.coordinates[0] * 0.1) % (Math.PI * 2));
        pContainer.position.set(Math.cos(initialAngle) * pOrbitRadius, 0, Math.sin(initialAngle) * pOrbitRadius);
        pContainer.userData = { type: 'star', system: sys, isPlanet: true, planetData: p };
        eclipticGroup.add(pContainer);
        interactiveObjectsRef.current.push(pContainer);

        // Planet Mesh & Procedural / Canonical Surface
        let pMesh: THREE.Mesh;
        let pCloudsMesh: THREE.Mesh | null = null;
        let pRingMesh: THREE.Mesh | null = null;
        const pMoons: { mesh: THREE.Mesh; orbitRadius: number; orbitSpeed: number; angle: number }[] = [];

        if (isPrimaryPlanet) {
          // Primary Capital World (Arrakis, Caladan, Kaitain, Giedi Prime...)
          const maps = PlanetTextureGenerator.generateMaps(sys);
          const pSize = sys.isCustom ? 2.7 : (sys.strategicImportance === 'Crucial' ? 3.1 : 2.5);
          const pGeo = new THREE.SphereGeometry(pSize, 28, 28);
          const isWater = sys.surfaceTextureType === 'ocean' || sys.surfaceTextureType === 'imperial';
          const pMat = new THREE.MeshStandardMaterial({
            map: maps.diffuseMap,
            bumpMap: maps.bumpMap,
            bumpScale: 0.8,
            roughness: isWater ? 0.45 : 0.72,
            metalness: sys.surfaceTextureType === 'synthetic' ? 0.4 : 0.05,
            emissiveMap: maps.nightLightsMap,
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: isCurrentSelected ? 0.85 : 0.4
          });
          pMesh = new THREE.Mesh(pGeo, pMat);
          pMesh.userData = { type: 'star', system: sys, isPlanet: true };
          pContainer.add(pMesh);
          interactiveObjectsRef.current.push(pMesh);

          // Dynamic Cloud Layer on Primary Planet
          const cloudDensity = sys.cloudDensity ?? 0.6;
          if (sys.surfaceTextureType !== 'gas_giant' && cloudDensity > 0.1) {
            const cloudGeo = new THREE.SphereGeometry(pSize * 1.025, 24, 24);
            const cloudMat = new THREE.MeshStandardMaterial({
              map: maps.cloudMap,
              transparent: true,
              opacity: cloudDensity * 0.8,
              roughness: 0.9,
              depthWrite: false
            });
            pCloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
            pContainer.add(pCloudsMesh);
          }

          // Atmosphere scattering halo on Primary Planet
          const atmoGeo = new THREE.SphereGeometry(pSize * 1.16, 20, 20);
          const atmoMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(sys.atmosphereColor),
            transparent: true,
            opacity: isCurrentSelected ? 0.38 : 0.22,
            side: THREE.BackSide
          });
          const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
          pContainer.add(atmoMesh);

          // Primary World Target Reticle Ring
          const reticleGeo = new THREE.RingGeometry(pSize * 1.35, pSize * 1.6, 24);
          const reticleMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: isCurrentSelected ? 0.85 : 0.45
          });
          const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
          reticleMesh.rotation.x = Math.PI / 2;
          pContainer.add(reticleMesh);

          // Miniature Moon for Primary World
          if (p.moons && p.moons.length > 0) {
            const moonData = p.moons[0];
            const moonGeo = new THREE.SphereGeometry(0.65, 12, 12);
            const moonMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(moonData.color || '#d4d4d8') });
            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
            const moonOrbitR = pSize * 1.85;
            moonMesh.position.set(moonOrbitR, 0, 0);
            pContainer.add(moonMesh);
            pMoons.push({
              mesh: moonMesh,
              orbitRadius: moonOrbitR,
              orbitSpeed: 0.03,
              angle: 0
            });
          }
        } else {
          // Other system planets (Inner fiery/rocky, Gas Giant, Outer icy)
          const isGas = p.surfaceTextureType === 'gas_giant' || p.hasRings;
          const pSize = isGas ? 2.2 : (p.size ? Math.min(2.0, Math.max(1.1, p.size * 0.16)) : 1.3);
          const pGeo = new THREE.SphereGeometry(pSize, 20, 20);
          const pColor = new THREE.Color(p.color || '#94a3b8');
          const pMat = new THREE.MeshStandardMaterial({
            color: pColor,
            roughness: 0.65,
            metalness: 0.1
          });
          pMesh = new THREE.Mesh(pGeo, pMat);
          pMesh.userData = { type: 'star', system: sys, isPlanet: true };
          pContainer.add(pMesh);
          interactiveObjectsRef.current.push(pMesh);

          // Gas giant planetary rings
          if (isGas) {
            const ringGeo = new THREE.RingGeometry(pSize * 1.35, pSize * 2.2, 28);
            const ringMat = new THREE.MeshBasicMaterial({
              color: new THREE.Color(p.ringColor || p.color || '#38bdf8'),
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.65
            });
            pRingMesh = new THREE.Mesh(ringGeo, ringMat);
            pRingMesh.rotation.x = Math.PI / 2 + 0.3;
            pContainer.add(pRingMesh);
          }
        }

        // Calculate planetary orbit speed (inner planets orbit faster)
        const orbitSpeed = (0.010 / Math.sqrt(pIdx + 1)) * 0.7;

        animatedPlanetsList.push({
          container: pContainer,
          mesh: pMesh,
          cloudsMesh: pCloudsMesh,
          ringMesh: pRingMesh,
          orbitRadius: pOrbitRadius,
          orbitSpeed: orbitSpeed,
          angle: initialAngle,
          rotSpeed: 0.005 + (Math.abs(sys.coordinates[1] % 3) * 0.001),
          isPrimary: isPrimaryPlanet,
          moons: pMoons
        });
      });

      // Selection Beacon Ring for the whole system
      if (isCurrentSelected) {
        const selSysRingGeo = new THREE.RingGeometry(maxOrbitRadius + 3.8, maxOrbitRadius + 5.2, 48);
        const selSysRingMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85
        });
        const selSysRing = new THREE.Mesh(selSysRingGeo, selSysRingMat);
        selSysRing.rotation.x = Math.PI / 2;
        eclipticGroup.add(selSysRing);
      }

      // Vertical Starlight Tactical Beacon to grid plane
      const beaconGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -70 - sys.coordinates[1], 0)
      ]);
      const beaconMat = new THREE.LineDashedMaterial({
        color: starColor,
        dashSize: 3.5,
        gapSize: 3.5,
        transparent: true,
        opacity: 0.25
      });
      const beaconLine = new THREE.Line(beaconGeo, beaconMat);
      beaconLine.computeLineDistances();
      systemContainer.add(beaconLine);

      // Base footprint ring on grid floor
      const baseRingGeo = new THREE.RingGeometry(3.5, 5.2, 16);
      const baseRingMat = new THREE.MeshBasicMaterial({
        color: starColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRing.position.set(0, -70 - sys.coordinates[1], 0);
      baseRing.rotation.x = Math.PI / 2;
      systemContainer.add(baseRing);

      galacticGroup.add(systemContainer);
      interactiveObjectsRef.current.push(systemContainer);

      galacticSystemsRef.current.push({
        systemContainer: systemContainer,
        system: sys,
        starMesh: starMesh,
        starCorona: starCorona,
        secondaryStarMesh: secondaryStarMesh,
        secondaryStarOrbitRadius: secondaryStarOrbitRadius,
        secondaryStarOrbitSpeed: secondaryStarOrbitSpeed,
        secondaryStarAngle: secondaryStarAngle,
        planets: animatedPlanetsList
      });
    });

    // Build Fiefdom indicators (clean subtle territory rings)
    if (config.showFiefdomSpheres && config.activeFilter === 'fiefs') {
      const houseList = Object.values(HOUSES_DATA);
      houseList.forEach((house) => {
        const capitalSys = systems.find(s => s.id === house.capitalSystemId);
        if (capitalSys) {
          const sphereRadius = house.territoryInfluenceRadius * 0.75;
          const fiefRingGeo = new THREE.RingGeometry(sphereRadius * 0.95, sphereRadius * 1.02, 48);
          const fiefRingMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(house.accentColor),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.22
          });
          const fiefRing = new THREE.Mesh(fiefRingGeo, fiefRingMat);
          fiefRing.position.set(capitalSys.coordinates[0], capitalSys.coordinates[1], capitalSys.coordinates[2]);
          fiefRing.rotation.x = Math.PI / 2;
          fiefdomsGroup.add(fiefRing);
        }
      });
    }

    // Build Spacing Guild Heighliner Space-Folding Jump Conduits (Animated Bezier Conduits)
    if (config.showGuildRoutes || config.activeFilter === 'guild-routes' || config.activeFilter === 'all') {
      const arrakisSys = systems.find(s => s.id === 'arrakis');

      if (arrakisSys) {
        const arrakisPos = new THREE.Vector3(arrakisSys.coordinates[0], arrakisSys.coordinates[1], arrakisSys.coordinates[2]);
        
        visibleSystems.filter(s => s.id !== 'arrakis').forEach(otherSys => {
          const otherPos = new THREE.Vector3(otherSys.coordinates[0], otherSys.coordinates[1], otherSys.coordinates[2]);
          
          // Bezier curve arching smoothly through hyperspace
          const midPoint = new THREE.Vector3()
            .addVectors(arrakisPos, otherPos)
            .multiplyScalar(0.5);
          midPoint.y += 35 + Math.sin(otherPos.x * 0.05) * 20;

          const curve = new THREE.QuadraticBezierCurve3(arrakisPos, midPoint, otherPos);
          const curvePoints = curve.getPoints(50);
          const routeGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

          const isJunctionRoute = otherSys.id === 'junction';
          const routeMat = new THREE.LineBasicMaterial({
            color: isJunctionRoute ? 0x06b6d4 : 0x38bdf8,
            transparent: true,
            opacity: isJunctionRoute ? 0.55 : 0.24
          });

          const routeLine = new THREE.Line(routeGeo, routeMat);
          guildRoutesGroup.add(routeLine);

          // Animated Light Pulse Mesh
          const pulseGeo = new THREE.SphereGeometry(1.8, 12, 12);
          const pulseMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.85
          });
          const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
          guildRoutesGroup.add(pulseMesh);

          routePulsePointsRef.current.push({
            line: routeLine,
            curve: curve,
            t: Math.random(),
            speed: 0.003 + Math.random() * 0.003,
            pulseMesh: pulseMesh
          });
        });
      }
    }
  }, [systems, selectedSystem, config.activeFilter, config.showFiefdomSpheres, config.showGuildRoutes]);

  // Astrogation / Distance Measurement Laser Beam Rendering
  useEffect(() => {
    const astrogationGroup = astrogationLineGroupRef.current;
    while (astrogationGroup.children.length > 0) {
      astrogationGroup.remove(astrogationGroup.children[0]);
    }

    if (isMeasuringMode && measuringTargetSystem && measuringTargetSystem.id !== selectedSystem.id) {
      const p1 = new THREE.Vector3(selectedSystem.coordinates[0], selectedSystem.coordinates[1], selectedSystem.coordinates[2]);
      const p2 = new THREE.Vector3(measuringTargetSystem.coordinates[0], measuringTargetSystem.coordinates[1], measuringTargetSystem.coordinates[2]);

      const points = [p1, p2];
      const laserGeo = new THREE.BufferGeometry().setFromPoints(points);
      const laserMat = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        linewidth: 3,
        transparent: true,
        opacity: 0.85
      });
      const laserLine = new THREE.Line(laserGeo, laserMat);
      astrogationGroup.add(laserLine);

      // Midpoint measurement marker beacon
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const midMarkerGeo = new THREE.RingGeometry(2.5, 3.5, 16);
      const midMarkerMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide
      });
      const midMarker = new THREE.Mesh(midMarkerGeo, midMarkerMat);
      midMarker.position.copy(mid);
      astrogationGroup.add(midMarker);
    }
  }, [isMeasuringMode, measuringTargetSystem, selectedSystem]);

  // Build System & Multi-Body Orbital Level with Full Sun(s), Planets, and Moons (Zoom Level = 'system')
  useEffect(() => {
    const orbitalGroup = systemOrbitalGroupRef.current;
    while (orbitalGroup.children.length > 0) {
      orbitalGroup.remove(orbitalGroup.children[0]);
    }
    systemStarsRef.current = [];
    systemPlanetsAnimatedRef.current = [];

    if (zoomLevel !== 'system') {
      orbitalGroup.visible = false;
      return;
    }

    orbitalGroup.visible = true;

    // Retrieve full canonical astronomical specification (Suns, Planets, Moons)
    const { stars, planets } = getSystemPlanetsAndStars(selectedSystem);

    // 1. Render Host Star(s) / Suns (Single, Binary, etc.)
    stars.forEach((star, idx) => {
      const isBinarySecond = idx > 0;
      const starRadius = star.radius || 20;
      const starGeo = new THREE.SphereGeometry(starRadius, 36, 36);
      const starMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(star.color),
        emissive: new THREE.Color(star.color),
        emissiveIntensity: 1.8,
        roughness: 0.15
      });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      
      const starOrbitRadius = star.orbitRadius || (isBinarySecond ? 180 : 0);
      const starOrbitSpeed = star.orbitSpeed || 0.0003;
      starMesh.position.set(starOrbitRadius, 0, 0);
      starMesh.userData = { type: 'star', system: selectedSystem, isSun: true, starData: star };
      orbitalGroup.add(starMesh);
      interactiveObjectsRef.current.push(starMesh);

      // Star Solar Corona Ring
      const sunCoronaGeo = new THREE.RingGeometry(starRadius * 1.2, starRadius * 1.75, 48);
      const sunCoronaMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(star.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      });
      const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
      sunCorona.rotation.x = Math.PI / 2;
      starMesh.add(sunCorona);

      systemStarsRef.current.push({
        mesh: starMesh,
        coronaMesh: sunCorona,
        orbitRadius: starOrbitRadius,
        orbitSpeed: starOrbitSpeed,
        angle: idx * Math.PI
      });
    });

    // 2. Render All Planets in the System with their Moons
    planets.forEach((planet, pIdx) => {
      const pRadius = planet.orbitRadius;

      // Concentric Orbit Track Line in Ecliptic Plane
      const orbitPathGeo = new THREE.BufferGeometry();
      const pts: number[] = [];
      const segments = Math.max(64, Math.floor(pRadius * 1.2));
      for (let j = 0; j <= segments; j++) {
        const a = (j / segments) * Math.PI * 2;
        pts.push(Math.cos(a) * pRadius, 0, Math.sin(a) * pRadius);
      }
      orbitPathGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      
      const isPrimary = planet.isPrimary;
      const orbitPathMat = new THREE.LineBasicMaterial({
        color: isPrimary ? 0xf59e0b : 0x38bdf8,
        transparent: true,
        opacity: isPrimary ? 0.45 : 0.22
      });
      const orbitPath = new THREE.Line(orbitPathGeo, orbitPathMat);
      orbitalGroup.add(orbitPath);

      // Planet Container (rotates around central sun)
      const planetContainer = new THREE.Group();
      const initialAngle = (pIdx * (Math.PI * 2 / Math.max(1, planets.length))) + 0.4;
      planetContainer.position.set(Math.cos(initialAngle) * pRadius, 0, Math.sin(initialAngle) * pRadius);
      planetContainer.userData = { type: 'star', system: selectedSystem, isPlanet: true, planetData: planet };

      // Generate Planet Surface & Material
      const planetSysConfig: StarSystem = {
        ...selectedSystem,
        surfaceTextureType: planet.surfaceTextureType || 'desert',
        atmosphereColor: planet.atmosphereColor || selectedSystem.atmosphereColor,
        cloudDensity: planet.cloudDensity ?? 0.5,
        hasRings: planet.hasRings,
        ringColor: planet.ringColor
      };
      const maps = PlanetTextureGenerator.generateMaps(planetSysConfig);
      
      const pSize = planet.size || (planet.isPrimary ? 14.5 : 10);
      const planetGeo = new THREE.SphereGeometry(pSize, 40, 40);
      const isWater = planet.surfaceTextureType === 'ocean' || planet.surfaceTextureType === 'imperial';

      const planetMat = new THREE.MeshStandardMaterial({
        map: maps.diffuseMap,
        bumpMap: maps.bumpMap,
        bumpScale: 1.1,
        roughness: isWater ? 0.42 : 0.75,
        metalness: planet.surfaceTextureType === 'synthetic' ? 0.45 : 0.05,
        emissiveMap: maps.nightLightsMap,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: (config.nightLightsEnabled !== false) ? 0.75 : 0.0
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetContainer.add(planetMesh);

      // Clouds (If atmospheric planet)
      let cloudsMesh: THREE.Mesh | null = null;
      const cDensity = planet.cloudDensity ?? 0.5;
      if (planet.surfaceTextureType !== 'gas_giant' && cDensity > 0.05) {
        const cloudGeo = new THREE.SphereGeometry(pSize * 1.02, 32, 32);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: maps.cloudMap,
          transparent: true,
          opacity: cDensity * 0.88,
          roughness: 0.9,
          depthWrite: false
        });
        cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
        planetContainer.add(cloudsMesh);
      }

      // Planetary Rings (e.g. gas giants, Arrakis custom)
      let ringMesh: THREE.Mesh | null = null;
      if (planet.hasRings || planet.surfaceTextureType === 'gas_giant') {
        const ringGeo = new THREE.RingGeometry(pSize * 1.35, pSize * 2.35, 48);
        const ringMat = new THREE.MeshStandardMaterial({
          map: maps.ringMap || maps.diffuseMap,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          roughness: 0.85
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 + 0.35;
        planetContainer.add(ringMesh);
      }

      // Atmospheric Halo
      const atmoColor = planet.atmosphereColor || selectedSystem.atmosphereColor;
      const atmoGeo = new THREE.SphereGeometry(pSize * 1.15, 28, 28);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(atmoColor),
        transparent: true,
        opacity: isPrimary ? 0.32 : 0.2,
        side: THREE.BackSide
      });
      const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
      planetContainer.add(atmoMesh);

      // Primary Planet Tactical Beacon Ring
      if (isPrimary) {
        const beaconGeo = new THREE.RingGeometry(pSize * 1.25, pSize * 1.35, 36);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const beaconRing = new THREE.Mesh(beaconGeo, beaconMat);
        beaconRing.rotation.x = Math.PI / 2;
        planetContainer.add(beaconRing);
      }

      // 3. Render Moons & Orbitals Around This Specific Planet
      const moonAnimatedObjects: {
        mesh: THREE.Mesh;
        orbitRadius: number;
        orbitSpeed: number;
        angle: number;
      }[] = [];

      planet.moons.forEach((moon, mIdx) => {
        const mRadius = moon.orbitRadius || (pSize + 12 + mIdx * 10);
        
        // Mini Orbit Line around parent planet
        const moonOrbitGeo = new THREE.BufferGeometry();
        const moonPts: number[] = [];
        for (let j = 0; j <= 36; j++) {
          const a = (j / 36) * Math.PI * 2;
          moonPts.push(Math.cos(a) * mRadius, 0, Math.sin(a) * mRadius);
        }
        moonOrbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(moonPts, 3));
        const moonOrbitMat = new THREE.LineBasicMaterial({
          color: moon.type === 'heighliner_dock' ? 0x06b6d4 : 0x94a3b8,
          transparent: true,
          opacity: 0.28
        });
        const moonOrbit = new THREE.Line(moonOrbitGeo, moonOrbitMat);
        planetContainer.add(moonOrbit);

        // Moon / Station Mesh
        let moonMesh: THREE.Mesh;
        if (moon.type === 'heighliner_dock') {
          const dockGeo = new THREE.CylinderGeometry(1.8, 1.8, 6, 16);
          dockGeo.rotateZ(Math.PI / 2);
          const dockMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            metalness: 0.85,
            roughness: 0.25
          });
          moonMesh = new THREE.Mesh(dockGeo, dockMat);
        } else if (moon.type === 'space_station' || moon.type === 'orbital_refinery' || moon.type === 'defense_fortress') {
          const stationGeo = new THREE.OctahedronGeometry(moon.size || 2.4, 0);
          const stationMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(moon.color || '#f59e0b'),
            metalness: 0.6,
            roughness: 0.3
          });
          moonMesh = new THREE.Mesh(stationGeo, stationMat);
        } else {
          const moonGeo = new THREE.SphereGeometry(moon.size || 2.2, 16, 16);
          const moonMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(moon.color || '#cbd5e1'),
            roughness: 0.7
          });
          moonMesh = new THREE.Mesh(moonGeo, moonMat);
        }

        const moonAngle = (mIdx * (Math.PI * 2 / Math.max(1, planet.moons.length)));
        moonMesh.position.set(Math.cos(moonAngle) * mRadius, 0, Math.sin(moonAngle) * mRadius);
        planetContainer.add(moonMesh);

        moonAnimatedObjects.push({
          mesh: moonMesh,
          orbitRadius: mRadius,
          orbitSpeed: moon.orbitSpeed || 0.01,
          angle: moonAngle
        });
      });

      orbitalGroup.add(planetContainer);
      interactiveObjectsRef.current.push(planetContainer);

      systemPlanetsAnimatedRef.current.push({
        planetContainer: planetContainer,
        planetMesh: planetMesh,
        cloudsMesh: cloudsMesh,
        ringMesh: ringMesh,
        orbitAngle: initialAngle,
        orbitRadius: pRadius,
        orbitSpeed: planet.orbitSpeed || (0.002 / (pIdx + 1)),
        rotSpeed: (config.planetRotationSpeed ?? 1.0) * (planet.rotationSpeed || 0.003),
        planetData: planet,
        moons: moonAnimatedObjects
      });
    });
  }, [
    zoomLevel, 
    selectedSystem, 
    config.surfaceBumpStrength, 
    config.nightLightsEnabled, 
    config.showShieldMeshes, 
    config.planetRotationSpeed, 
    getThemeColor
  ]);

  // Build Planetary / Tactical Holosphere (Zoom Level = 'planetary')
  useEffect(() => {
    const planetaryGroup = planetaryGroupRef.current;
    
    // Clear planetary children
    while (planetaryGroup.children.length > 0) {
      planetaryGroup.remove(planetaryGroup.children[0]);
    }
    const poiGroup = poiPinsGroupRef.current;
    while (poiGroup.children.length > 0) {
      poiGroup.remove(poiGroup.children[0]);
    }
    planetaryGroup.add(poiGroup);

    if (zoomLevel !== 'planetary' && zoomLevel !== 'tactical') {
      planetaryGroup.visible = false;
      return;
    }

    planetaryGroup.visible = true;

    // Base Planet Sphere
    const planetRadius = 45;
    const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);

    // Generate Photorealistic Multi-Layer Procedural Textures & Normal Maps
    const maps = PlanetTextureGenerator.generateMaps(selectedSystem);

    const bumpScaleVal = (config.surfaceBumpStrength ?? 1.2) * (selectedSystem.bumpScale ?? 1.2);
    const nightLightsActive = config.nightLightsEnabled !== false;
    const isWaterWorld = selectedSystem.surfaceTextureType === 'ocean' || selectedSystem.surfaceTextureType === 'imperial';

    const planetMat = new THREE.MeshStandardMaterial({
      map: maps.diffuseMap,
      bumpMap: maps.bumpMap,
      bumpScale: bumpScaleVal,
      roughness: isWaterWorld ? 0.45 : 0.72,
      metalness: selectedSystem.surfaceTextureType === 'synthetic' ? 0.45 : 0.06,
      emissiveMap: maps.nightLightsMap,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: nightLightsActive ? (selectedSystem.nightLightsIntensity ?? 0.85) : 0.0
    });

    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    planetMeshRef.current = planetMesh;
    planetaryGroup.add(planetMesh);

    // 2. Realistic Dynamic Cloud Layer
    const cloudDensity = selectedSystem.cloudDensity ?? 0.65;
    if (selectedSystem.surfaceTextureType !== 'gas_giant' && cloudDensity > 0.05) {
      const cloudGeo = new THREE.SphereGeometry(planetRadius * 1.018, 64, 64);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: maps.cloudMap,
        transparent: true,
        opacity: cloudDensity * 0.95,
        roughness: 0.92,
        metalness: 0.0,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      cloudMeshRef.current = cloudMesh;
      planetaryGroup.add(cloudMesh);
    } else {
      cloudMeshRef.current = null;
    }

    // 3. Planetary Rings (For Gas Giants or ringed custom worlds)
    if (selectedSystem.hasRings || selectedSystem.surfaceTextureType === 'gas_giant') {
      const ringGeo = new THREE.RingGeometry(planetRadius * 1.35, planetRadius * 2.35, 64);
      
      // Fix Ring UV mapping to map radially
      const pos = ringGeo.attributes.position;
      const uvs = ringGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const d = Math.sqrt(x * x + y * y);
        const u = (d - planetRadius * 1.35) / (planetRadius * 2.35 - planetRadius * 1.35);
        uvs.setXY(i, u, 0.5);
      }
      uvs.needsUpdate = true;

      const ringMat = new THREE.MeshStandardMaterial({
        map: maps.ringMap || maps.diffuseMap,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        roughness: 0.85
      });

      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + 0.38;
      ringMesh.rotation.y = 0.15;
      ringMeshRef.current = ringMesh;
      planetaryGroup.add(ringMesh);
    } else {
      ringMeshRef.current = null;
    }

    // 4. Holographic Hexagonal Wireframe Holtzman Shield (If enabled)
    if (config.showShieldMeshes) {
      const shieldGeo = new THREE.IcosahedronGeometry(planetRadius * 1.06, 3);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: getThemeColor('primary'),
        wireframe: true,
        transparent: true,
        opacity: 0.16
      });
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMeshRef.current = shieldMesh;
      planetaryGroup.add(shieldMesh);
    }

    // 5. Atmospheric Rayleigh Scattering Halo
    const atmoIntensity = config.atmosphereGlowIntensity ?? 1.1;
    const atmoGeo = new THREE.SphereGeometry(planetRadius * 1.15, 36, 36);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(selectedSystem.atmosphereColor),
      transparent: true,
      opacity: 0.20 * atmoIntensity,
      side: THREE.BackSide
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmosphereMeshRef.current = atmoMesh;
    planetaryGroup.add(atmoMesh);

    // 6. Tactical POI Pins on the planet sphere
    selectedSystem.tacticalPOIs.forEach((poi) => {
      const lat = poi.coordinates[0];
      const lon = poi.coordinates[1];

      // Convert Lat/Lon to 3D Cartesian coordinates on sphere
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const r = planetRadius * 1.01;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      const poiGroupItem = new THREE.Group();
      poiGroupItem.position.set(x, y, z);
      poiGroupItem.lookAt(x * 2, y * 2, z * 2);

      const pinColor = poi.threatLevel === 'Critique' || poi.threatLevel === 'Cataclysmique' 
        ? 0xef4444 
        : poi.type === 'spice_field' 
        ? 0xf59e0b 
        : 0x06b6d4;

      const pinGeo = new THREE.CylinderGeometry(0.4, 0.9, 6, 8);
      pinGeo.rotateX(Math.PI / 2);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.z = 3;
      poiGroupItem.add(pinMesh);

      // Radar Ring Beacon
      const poiRingGeo = new THREE.RingGeometry(1.6, 2.4, 16);
      const poiRingMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const poiRingMesh = new THREE.Mesh(poiRingGeo, poiRingMat);
      poiRingMesh.position.z = 6.2;
      poiGroupItem.add(poiRingMesh);

      poiGroupItem.userData = { type: 'poi', poi: poi };
      poiGroup.add(poiGroupItem);
      interactiveObjectsRef.current.push(poiGroupItem);
    });
  }, [
    zoomLevel, 
    selectedSystem, 
    config.showShieldMeshes, 
    config.surfaceBumpStrength, 
    config.nightLightsEnabled, 
    config.atmosphereGlowIntensity, 
    getThemeColor
  ]);

  // Adjust Camera targets when Zoom Level or Selected System changes
  useEffect(() => {
    audioSynth.playZoomTransition();

    if (zoomLevel === 'deep_space') {
      targetCamPosRef.current.set(0, 480, 1180);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (zoomLevel === 'galactic') {
      targetCamPosRef.current.set(0, 240, 520);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (zoomLevel === 'system') {
      targetCamPosRef.current.set(0, 55, 175);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (zoomLevel === 'planetary') {
      targetCamPosRef.current.set(0, 24, 88);
      targetLookAtRef.current.set(0, 0, 0);
    } else if (zoomLevel === 'tactical') {
      targetCamPosRef.current.set(0, 12, 50);
      targetLookAtRef.current.set(0, 0, 0);
    }
  }, [zoomLevel, selectedSystem]);

  // Main Render Loop with Smooth Interpolation, Orbiting Bodies & Bezier Light Pulses
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Parallax smooth interpolation
      const p = mouseParallaxRef.current;
      p.x += (p.targetX - p.x) * 0.05;
      p.y += (p.targetY - p.y) * 0.05;

      // Rotate galaxy spice dust
      if (spiceParticlesRef.current) {
        spiceParticlesRef.current.rotation.y += 0.0005;
      }

      // Animate Guild Jump Light Pulses
      routePulsePointsRef.current.forEach((item) => {
        item.t = (item.t + item.speed) % 1.0;
        const pos = item.curve.getPoint(item.t);
        item.pulseMesh.position.copy(pos);
      });

      // Animate all multi-body planetary systems in Galactic and Deep Space View
      if (zoomLevel === 'deep_space' || zoomLevel === 'galactic') {
        galacticSystemsRef.current.forEach((sysObj) => {
          // Central Star Corona pulse and gentle rotation
          if (sysObj.starCorona) {
            sysObj.starCorona.rotation.z += 0.0025;
          }

          // Binary companion star orbit revolution
          if (sysObj.secondaryStarMesh && sysObj.secondaryStarOrbitRadius && sysObj.secondaryStarOrbitSpeed) {
            sysObj.secondaryStarAngle = (sysObj.secondaryStarAngle || 0) + sysObj.secondaryStarOrbitSpeed;
            sysObj.secondaryStarMesh.position.x = Math.cos(sysObj.secondaryStarAngle) * sysObj.secondaryStarOrbitRadius;
            sysObj.secondaryStarMesh.position.z = Math.sin(sysObj.secondaryStarAngle) * sysObj.secondaryStarOrbitRadius;
          }

          // Animate each orbiting planet in the planetary system
          sysObj.planets.forEach((pObj) => {
            pObj.angle += pObj.orbitSpeed;
            pObj.container.position.x = Math.cos(pObj.angle) * pObj.orbitRadius;
            pObj.container.position.z = Math.sin(pObj.angle) * pObj.orbitRadius;
            pObj.mesh.rotation.y += pObj.rotSpeed;

            if (pObj.cloudsMesh) {
              pObj.cloudsMesh.rotation.y += pObj.rotSpeed * 1.35;
            }

            // Animate planet moons orbiting their parent world
            if (pObj.moons) {
              pObj.moons.forEach((mObj) => {
                mObj.angle += mObj.orbitSpeed;
                mObj.mesh.position.x = Math.cos(mObj.angle) * mObj.orbitRadius;
                mObj.mesh.position.z = Math.sin(mObj.angle) * mObj.orbitRadius;
              });
            }
          });
        });
      }

      // Animate All Stars, Planets & Orbiting Moons at System Level
      if (zoomLevel === 'system') {
        // Animate binary stars if present
        systemStarsRef.current.forEach((starObj) => {
          if (starObj.orbitRadius > 0) {
            starObj.angle += starObj.orbitSpeed;
            starObj.mesh.position.x = Math.cos(starObj.angle) * starObj.orbitRadius;
            starObj.mesh.position.z = Math.sin(starObj.angle) * starObj.orbitRadius;
          }
        });

        // Animate all planets and their respective moons
        systemPlanetsAnimatedRef.current.forEach((planetObj) => {
          planetObj.orbitAngle += planetObj.orbitSpeed;
          planetObj.planetContainer.position.x = Math.cos(planetObj.orbitAngle) * planetObj.orbitRadius;
          planetObj.planetContainer.position.z = Math.sin(planetObj.orbitAngle) * planetObj.orbitRadius;
          planetObj.planetMesh.rotation.y += planetObj.rotSpeed;

          if (planetObj.cloudsMesh) {
            planetObj.cloudsMesh.rotation.y += planetObj.rotSpeed * 1.35;
          }

          // Animate moons orbiting around this parent planet
          planetObj.moons.forEach((moonObj) => {
            moonObj.angle += moonObj.orbitSpeed;
            moonObj.mesh.position.x = Math.cos(moonObj.angle) * moonObj.orbitRadius;
            moonObj.mesh.position.z = Math.sin(moonObj.angle) * moonObj.orbitRadius;
          });
        });
      }

      // Rotate planet, clouds and shields at Planetary & Tactical Level
      if (planetMeshRef.current && (zoomLevel === 'planetary' || zoomLevel === 'tactical')) {
        const rotSpeed = (config.planetRotationSpeed ?? 1.0) * 0.0014;
        planetMeshRef.current.rotation.y += rotSpeed;

        if (cloudMeshRef.current && config.cloudAnimation !== false) {
          const cloudRotSpeed = (config.cloudSpeed ?? 1.0) * 0.0022;
          cloudMeshRef.current.rotation.y += cloudRotSpeed;
        }

        if (shieldMeshRef.current) {
          shieldMeshRef.current.rotation.y -= 0.0008;
          shieldMeshRef.current.rotation.x += 0.0003;
        }
      }

      // Smooth camera position and lookAt interpolation (LERP)
      if (cameraRef.current) {
        const cam = cameraRef.current;
        const targetPos = targetCamPosRef.current.clone();

        // Apply Parallax offset
        const parallaxFactor = config.parallaxDepth * 28;
        targetPos.x += p.x * parallaxFactor;
        targetPos.y += p.y * (parallaxFactor * 0.6);

        // Apply user orbit rotation around target across all views (Galactic, System, Planetary)
        const orbitDist = targetPos.length();
        targetPos.x = orbitDist * Math.sin(orbitRotationRef.current.theta) * Math.cos(orbitRotationRef.current.phi);
        targetPos.y = orbitDist * Math.sin(orbitRotationRef.current.phi);
        targetPos.z = orbitDist * Math.cos(orbitRotationRef.current.theta) * Math.cos(orbitRotationRef.current.phi);

        cam.position.lerp(targetPos, 0.045);
        currentLookAtRef.current.lerp(targetLookAtRef.current, 0.045);
        cam.lookAt(currentLookAtRef.current);
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [zoomLevel, config.parallaxDepth]);

  // Pointer & Gesture Handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouseCoordsRef.current.set(nx, ny);
    mouseParallaxRef.current.targetX = nx;
    mouseParallaxRef.current.targetY = ny;

    // Handle Drag Orbit
    if (isDraggingRef.current) {
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;

      orbitRotationRef.current.theta -= dx * 0.006;
      orbitRotationRef.current.phi = Math.max(-0.85, Math.min(1.25, orbitRotationRef.current.phi + dy * 0.006));

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    // Raycast for hover effects
    if (cameraRef.current && sceneRef.current) {
      raycasterRef.current.setFromCamera(mouseCoordsRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && !rootObj.userData.type && rootObj.parent) {
          rootObj = rootObj.parent;
        }

        if (rootObj && rootObj.userData.type) {
          if (hoveredObjectRef.current !== rootObj) {
            hoveredObjectRef.current = rootObj;
            if (containerRef.current) containerRef.current.style.cursor = 'pointer';

            if (rootObj.userData.type === 'star') {
              const hoveredSys = rootObj.userData.system as StarSystem;
              if (onHoverSystem) onHoverSystem(hoveredSys);
            }
          }
        }
      } else {
        if (hoveredObjectRef.current) {
          hoveredObjectRef.current = null;
          if (containerRef.current) containerRef.current.style.cursor = 'grab';
          if (onHoverSystem) onHoverSystem(null);
        }
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = Math.abs(e.clientX - prevMousePosRef.current.x) > 4 || Math.abs(e.clientY - prevMousePosRef.current.y) > 4;
    isDraggingRef.current = false;
    if (containerRef.current) containerRef.current.style.cursor = 'grab';

    if (!wasDragging && cameraRef.current) {
      raycasterRef.current.setFromCamera(mouseCoordsRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && !rootObj.userData.type && rootObj.parent) {
          rootObj = rootObj.parent;
        }

        if (rootObj) {
          if (rootObj.userData.type === 'star') {
            const sys = rootObj.userData.system as StarSystem;
            onSelectSystem(sys);
            if (zoomLevel === 'deep_space') {
              onZoomChange('galactic');
            } else if (zoomLevel === 'galactic') {
              onZoomChange('system');
            } else if (zoomLevel === 'system') {
              onZoomChange('planetary');
            } else if (zoomLevel === 'planetary') {
              onZoomChange('tactical');
            }
          } else if (rootObj.userData.type === 'poi') {
            const poi = rootObj.userData.poi as TacticalPOI;
            onSelectPOI(poi);
            if (zoomLevel !== 'tactical') {
              onZoomChange('tactical');
            }
          }
        }
      }
    }
  };

  // Wheel Zoom with nuanced 5-tier stepping & debounce
  const lastWheelTimeRef = useRef(0);
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 200) return;
    lastWheelTimeRef.current = now;

    const ZOOM_TIERS: ZoomLevel[] = ['deep_space', 'galactic', 'system', 'planetary', 'tactical'];
    const currentIndex = ZOOM_TIERS.indexOf(zoomLevel);

    if (e.deltaY > 0) {
      // Zoom out (towards wider deep space view)
      if (currentIndex > 0) {
        audioSynth.playHoloClick(1100 + currentIndex * 100);
        onZoomChange(ZOOM_TIERS[currentIndex - 1]);
      }
    } else if (e.deltaY < 0) {
      // Zoom in (towards surface tactical view)
      if (currentIndex < ZOOM_TIERS.length - 1) {
        audioSynth.playHoloClick(1300 + (currentIndex + 1) * 100);
        onZoomChange(ZOOM_TIERS[currentIndex + 1]);
      }
    }
  };

  // Touch Pinch Zoom Handler for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (pinchDistRef.current !== null) {
        const diff = dist - pinchDistRef.current;
        const ZOOM_TIERS: ZoomLevel[] = ['deep_space', 'galactic', 'system', 'planetary', 'tactical'];
        const currentIndex = ZOOM_TIERS.indexOf(zoomLevel);

        if (diff > 45 && currentIndex < ZOOM_TIERS.length - 1) {
          audioSynth.playHoloClick(1500);
          onZoomChange(ZOOM_TIERS[currentIndex + 1]);
          pinchDistRef.current = dist;
        } else if (diff < -45 && currentIndex > 0) {
          audioSynth.playHoloClick(1200);
          onZoomChange(ZOOM_TIERS[currentIndex - 1]);
          pinchDistRef.current = dist;
        }
      } else {
        pinchDistRef.current = dist;
      }
    }
  };

  const handleTouchEnd = () => {
    pinchDistRef.current = null;
  };

  // Device Orientation (Gyroscope Parallax for Mobile)
  useEffect(() => {
    if (!config.gyroscopeParallax || typeof window === 'undefined') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        mouseParallaxRef.current.targetX = Math.max(-1, Math.min(1, event.gamma / 35));
        mouseParallaxRef.current.targetY = Math.max(-1, Math.min(1, (event.beta - 45) / 35));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [config.gyroscopeParallax]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Holographic Scanlines & Grain Layer */}
      {config.scanlinesIntensity > 0 && (
        <div 
          className="absolute inset-0 pointer-events-none scanlines"
          style={{ opacity: config.scanlinesIntensity }}
        />
      )}

      {/* Holographic Radial Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(6,7,9,0.7)_85%,rgba(6,7,9,0.95)_100%)]" />

      {/* Low-Light Vision Filter if enabled */}
      {config.lowLightMode && (
        <div className="absolute inset-0 pointer-events-none bg-red-950/20 mix-blend-color-dodge backdrop-brightness-90" />
      )}
    </div>
  );
});

HolosphereCanvas.displayName = 'HolosphereCanvas';

