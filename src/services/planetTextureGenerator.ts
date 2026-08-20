import * as THREE from 'three';
import { StarSystem, SurfaceTextureType } from '../types/landsraad';

// Lightweight pseudo-random deterministic noise helper
class FastNoise {
  private seed: number;

  constructor(seed: number = 1337) {
    this.seed = seed;
  }

  // 2D pseudo random noise
  private rand(x: number, y: number): number {
    const s = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453;
    return s - Math.floor(s);
  }

  // Smooth Interpolated Noise
  public noise2D(x: number, y: number): number {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    // Cubic smoothstep
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = this.rand(i, j);
    const b = this.rand(i + 1, j);
    const c = this.rand(i, j + 1);
    const d = this.rand(i + 1, j + 1);

    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  // Fractional Brownian Motion (Multi-octave noise)
  public fbm(x: number, y: number, octaves: number = 5, persistence: number = 0.5): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      total += this.noise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2.0;
    }

    return total / maxValue;
  }

  // Domain warping for turbulent atmospheric clouds & storms
  public warpedFbm(x: number, y: number, octaves: number = 4): number {
    const qx = this.fbm(x, y, octaves);
    const qy = this.fbm(x + 5.2, y + 1.3, octaves);
    return this.fbm(x + 4.0 * qx, y + 4.0 * qy, octaves);
  }
}

// Color conversion helpers
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return [r, g, b];
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  const clampT = Math.max(0, Math.min(1, t));
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * clampT),
    Math.round(c1[1] + (c2[1] - c1[1]) * clampT),
    Math.round(c1[2] + (c2[2] - c1[2]) * clampT)
  ];
}

export interface GeneratedPlanetMaps {
  diffuseMap: THREE.CanvasTexture | THREE.Texture;
  bumpMap: THREE.CanvasTexture;
  specularMap: THREE.CanvasTexture;
  nightLightsMap: THREE.CanvasTexture;
  cloudMap: THREE.CanvasTexture;
  ringMap?: THREE.CanvasTexture;
}

export class PlanetTextureGenerator {
  private static cache: Map<string, GeneratedPlanetMaps> = new Map();

  public static generateMaps(system: StarSystem): GeneratedPlanetMaps {
    // Check cache
    const cacheKey = `${system.id}_${system.surfaceTextureType}_${system.atmosphereColor}_${system.cloudDensity || 0.6}_${system.hasRings}_${system.customImageUrl || 'none'}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // If custom image is provided, load it as texture or blend it
    let customDiffuseTexture: THREE.Texture | null = null;
    if (system.customImageUrl) {
      try {
        const loader = new THREE.TextureLoader();
        const loadedTex = loader.load(system.customImageUrl);
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        customDiffuseTexture = loadedTex;
      } catch (err) {
        console.warn('Failed to load custom planet image texture:', err);
      }
    }

    const width = 1024;
    const height = 512;

    const seed = system.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 42);
    const noise = new FastNoise(seed);

    // 1. Setup Canvases
    const diffuseCanvas = document.createElement('canvas');
    diffuseCanvas.width = width;
    diffuseCanvas.height = height;
    const diffuseCtx = diffuseCanvas.getContext('2d')!;
    const diffuseImgData = diffuseCtx.createImageData(width, height);
    const diffData = diffuseImgData.data;

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpCtx = bumpCanvas.getContext('2d')!;
    const bumpImgData = bumpCtx.createImageData(width, height);
    const bumpData = bumpImgData.data;

    const specCanvas = document.createElement('canvas');
    specCanvas.width = width;
    specCanvas.height = height;
    const specCtx = specCanvas.getContext('2d')!;
    const specImgData = specCtx.createImageData(width, height);
    const specData = specImgData.data;

    const nightCanvas = document.createElement('canvas');
    nightCanvas.width = width;
    nightCanvas.height = height;
    const nightCtx = nightCanvas.getContext('2d')!;
    const nightImgData = nightCtx.createImageData(width, height);
    const nightData = nightImgData.data;

    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = width;
    cloudCanvas.height = height;
    const cloudCtx = cloudCanvas.getContext('2d')!;
    const cloudImgData = cloudCtx.createImageData(width, height);
    const cloudData = cloudImgData.data;

    const textureType: SurfaceTextureType = system.surfaceTextureType || 'desert';
    const isPopulated = system.planetaryMetrics.populationTotal !== '0' && system.planetaryMetrics.populationTotal !== 'Inhabitée';

    // Palette setups based on biomes
    for (let y = 0; y < height; y++) {
      const ny = y / height; // 0 (North Pole) to 1 (South Pole)
      const lat = (ny - 0.5) * Math.PI; // -PI/2 to PI/2
      const isPolar = Math.abs(lat) > 1.25;

      for (let x = 0; x < width; x++) {
        const nx = x / width; // 0 to 1
        const idx = (y * width + x) * 4;

        // Spherical noise sampling (Seamless 2D mapping)
        const scale = 3.5;
        const cx = Math.cos(nx * Math.PI * 2) * Math.cos(lat) * scale;
        const cy = Math.sin(lat) * scale;
        const cz = Math.sin(nx * Math.PI * 2) * Math.cos(lat) * scale;

        const elevation = noise.fbm(cx + 10, cy + cz + 10, 6, 0.52);
        const detailNoise = noise.noise2D(cx * 8, cy * 8);

        let r = 0, g = 0, b = 0;
        let bumpVal = Math.round(elevation * 255);
        let specVal = 0;
        let nightVal = 0;

        // BIOME SPECIFIC RENDERING
        switch (textureType) {
          case 'desert': { // Arrakis, Salusa desert zones
            const duneNoise = noise.warpedFbm(cx * 6, cz * 6, 3);
            const spiceBlow = noise.noise2D(cx * 14, cy * 14);

            if (isPolar && elevation > 0.45) {
              // Polar ice/dust cap
              r = 235; g = 220; b = 200;
              bumpVal = 180;
              specVal = 40;
            } else if (elevation > 0.65) {
              // Shield Wall / Deep rocky Massifs
              const rockCol = lerpColor([120, 53, 15], [78, 30, 10], detailNoise);
              [r, g, b] = rockCol;
              bumpVal = Math.round(elevation * 255);
            } else if (spiceBlow > 0.82) {
              // Deep rich spice blow field (deep iridescent copper-amber)
              r = 245; g = 110; b = 25;
              bumpVal = 130;
              specVal = 70;
            } else {
              // Great Flat Erg & Sand Dunes
              const sandCol = lerpColor([217, 119, 6], [180, 83, 9], duneNoise);
              [r, g, b] = sandCol;
              bumpVal = Math.round((elevation * 0.5 + duneNoise * 0.5) * 190);
            }

            // Fremen Sietches & Arrakeen night lights in rock formations
            if (isPopulated && elevation > 0.62 && detailNoise > 0.78) {
              nightVal = Math.round((detailNoise - 0.78) * 1200);
            }
            break;
          }

          case 'ocean': { // Caladan (Lush Terran World)
            const seaLevel = 0.52;
            if (elevation < seaLevel) {
              // Deep ocean to shallow reefs
              const depthT = elevation / seaLevel;
              const oceanCol = lerpColor([4, 47, 95], [14, 116, 144], depthT);
              [r, g, b] = oceanCol;
              bumpVal = Math.round(depthT * 40);
              specVal = 240; // Intense specular glint on water
            } else if (isPolar) {
              // Glacial Arctic ice sheets
              r = 240; g = 248; b = 255;
              bumpVal = 200;
              specVal = 120;
            } else if (elevation < 0.62) {
              // Coastal lush river valleys & forests
              const forestCol = lerpColor([20, 83, 45], [22, 101, 52], detailNoise);
              [r, g, b] = forestCol;
              bumpVal = 120;
              specVal = 10;
            } else {
              // Mountain ranges (Castle Caladan massifs)
              const mountainCol = lerpColor([100, 116, 139], [226, 232, 240], (elevation - 0.62) * 3);
              [r, g, b] = mountainCol;
              bumpVal = Math.round(elevation * 255);
              specVal = 5;
            }

            // Caladan coastal city clusters
            if (isPopulated && elevation >= seaLevel && elevation < 0.60 && detailNoise > 0.68) {
              nightVal = Math.round((detailNoise - 0.68) * 900);
            }
            break;
          }

          case 'industrial': { // Giedi Prime / Grumman (Polluted smog world)
            const toxicLake = elevation < 0.44;
            if (toxicLake) {
              // Sulfuric acid runoff lakes
              [r, g, b] = [45, 30, 20];
              bumpVal = 30;
              specVal = 160;
            } else if (elevation > 0.68) {
              // Obsidian volcanic ridges
              const obsCol = lerpColor([24, 24, 27], [39, 39, 42], detailNoise);
              [r, g, b] = obsCol;
              bumpVal = Math.round(elevation * 255);
            } else {
              // Slag plains & heavy industrial zones
              const slagCol = lerpColor([50, 45, 40], [70, 60, 55], detailNoise);
              [r, g, b] = slagCol;
              bumpVal = 110;
            }

            // Massive Barony Harko Megalopolises & Smelters (Bright red/amber night lights)
            if (isPopulated && elevation >= 0.44 && detailNoise > 0.55) {
              nightVal = Math.round((detailNoise - 0.55) * 800);
            }
            break;
          }

          case 'imperial': { // Kaitain (Imperial Crown Jewel)
            const seaLevel = 0.48;
            if (elevation < seaLevel) {
              const imperialOcean = lerpColor([12, 74, 110], [56, 189, 248], elevation / seaLevel);
              [r, g, b] = imperialOcean;
              specVal = 250;
              bumpVal = 35;
            } else if (elevation < 0.65) {
              // Golden imperial gardens & terraformed meadows
              const gardenCol = lerpColor([5, 150, 105], [217, 119, 6], detailNoise * 0.4);
              [r, g, b] = gardenCol;
              bumpVal = 130;
              specVal = 20;
            } else {
              // Crystalline marble mountain chains
              [r, g, b] = [245, 245, 245];
              bumpVal = Math.round(elevation * 255);
            }

            // Sprawling Golden Imperial Corrino Megalopolis
            if (isPopulated && elevation >= seaLevel && detailNoise > 0.50) {
              nightVal = Math.round((detailNoise - 0.50) * 1100);
            }
            break;
          }

          case 'synthetic': { // Ix / Richese (Technological Forge World)
            const gridNoise = (Math.abs(Math.sin(nx * 140)) > 0.9 || Math.abs(Math.sin(ny * 100)) > 0.9) ? 1 : 0;
            if (gridNoise && elevation > 0.4) {
              // Glowing subterranean ventilation & cybernetic conduits
              [r, g, b] = [16, 185, 129];
              bumpVal = 220;
              specVal = 180;
              nightVal = 250;
            } else if (elevation > 0.55) {
              // Machine complexes & alloy superstructures
              const alloyCol = lerpColor([30, 41, 59], [51, 65, 85], detailNoise);
              [r, g, b] = alloyCol;
              bumpVal = 190;
              specVal = 120;
            } else {
              // Titanium plateaus
              [r, g, b] = [15, 23, 42];
              bumpVal = 80;
              specVal = 80;
            }

            if (isPopulated && detailNoise > 0.58) {
              nightVal = Math.max(nightVal, Math.round((detailNoise - 0.58) * 750));
            }
            break;
          }

          case 'volcanic': { // Salusa Secundus (Hellish Penal Planet)
            const lava = elevation < 0.38;
            if (lava) {
              // Magma cracks
              [r, g, b] = [239, 68, 68];
              bumpVal = 15;
              specVal = 200;
              nightVal = 220;
            } else {
              // Charred basalt & ash dunes
              const basalt = lerpColor([38, 38, 38], [64, 64, 64], detailNoise);
              [r, g, b] = basalt;
              bumpVal = Math.round(elevation * 255);
            }
            break;
          }

          case 'ice': { // Ginaz / Frozen Worlds
            const iceCrevasse = detailNoise < 0.25;
            if (iceCrevasse) {
              [r, g, b] = [125, 211, 252];
              bumpVal = 50;
              specVal = 200;
            } else {
              [r, g, b] = [240, 249, 255];
              bumpVal = Math.round(elevation * 240);
              specVal = 140;
            }
            if (isPopulated && detailNoise > 0.7) {
              nightVal = Math.round((detailNoise - 0.7) * 800);
            }
            break;
          }

          case 'gas_giant': { // Junction (Guild Atmosphere)
            const bandY = Math.sin(ny * Math.PI * 16 + detailNoise * 3);
            const stormSpot = Math.sqrt(Math.pow(nx - 0.65, 2) + Math.pow((ny - 0.55) * 2, 2));

            if (stormSpot < 0.08) {
              // Great Vortex Storm (Red/Cyan Eye)
              [r, g, b] = [244, 63, 94];
              bumpVal = 180;
            } else {
              // Gas Bands
              const bandCol = lerpColor([14, 116, 144], [245, 158, 11], (bandY + 1) * 0.5);
              [r, g, b] = bandCol;
              bumpVal = Math.round((bandY + 1) * 100);
            }
            specVal = 40;
            break;
          }

          case 'lush': // Ecaz / Wallach IX (Forest Paradise)
          default: {
            const seaLevel = 0.46;
            if (elevation < seaLevel) {
              [r, g, b] = [2, 132, 199];
              specVal = 240;
              bumpVal = 30;
            } else if (elevation < 0.70) {
              const lushCol = lerpColor([16, 185, 129], [5, 150, 105], detailNoise);
              [r, g, b] = lushCol;
              bumpVal = 130;
              specVal = 25;
            } else {
              [r, g, b] = [148, 163, 184];
              bumpVal = Math.round(elevation * 255);
            }
            if (isPopulated && elevation >= seaLevel && detailNoise > 0.60) {
              nightVal = Math.round((detailNoise - 0.60) * 850);
            }
            break;
          }
        }

        // Apply Diffuse Pixel
        diffData[idx] = r;
        diffData[idx + 1] = g;
        diffData[idx + 2] = b;
        diffData[idx + 3] = 255;

        // Apply Bump Pixel
        bumpData[idx] = bumpVal;
        bumpData[idx + 1] = bumpVal;
        bumpData[idx + 2] = bumpVal;
        bumpData[idx + 3] = 255;

        // Apply Specular Pixel
        specData[idx] = specVal;
        specData[idx + 1] = specVal;
        specData[idx + 2] = specVal;
        specData[idx + 3] = 255;

        // Apply Night Lights (City Golden Emissive on dark side)
        const cityRgb = textureType === 'industrial' ? [255, 90, 20] : textureType === 'synthetic' ? [50, 255, 180] : [255, 215, 0];
        const nightFactor = Math.min(255, nightVal) / 255;
        nightData[idx] = Math.round(cityRgb[0] * nightFactor);
        nightData[idx + 1] = Math.round(cityRgb[1] * nightFactor);
        nightData[idx + 2] = Math.round(cityRgb[2] * nightFactor);
        nightData[idx + 3] = Math.round(nightFactor * 255);

        // PROCEDURAL CLOUD LAYER MAP
        const cloudDensitySetting = system.cloudDensity ?? 0.6;
        if (textureType === 'gas_giant' || cloudDensitySetting <= 0.05) {
          cloudData[idx + 3] = 0;
        } else {
          const cloudNoise = noise.warpedFbm(cx * 4 + 20, cy * 4 + 20, 5);
          const cycloneEye = Math.sqrt(Math.pow(nx - 0.35, 2) + Math.pow((ny - 0.4) * 2, 2));
          let cloudAlpha = 0;

          if (cycloneEye < 0.06) {
            // Hurricane Storm vortex
            cloudAlpha = 0.95;
          } else if (cloudNoise > (1.1 - cloudDensitySetting * 0.7)) {
            cloudAlpha = Math.min(1.0, (cloudNoise - (1.1 - cloudDensitySetting * 0.7)) * 3.5);
          }

          // Desert planets have thin atmospheric dust storm streaks
          if (textureType === 'desert') {
            cloudData[idx] = 255;
            cloudData[idx + 1] = 225;
            cloudData[idx + 2] = 180;
            cloudData[idx + 3] = Math.round(cloudAlpha * 140 * cloudDensitySetting);
          } else {
            cloudData[idx] = 255;
            cloudData[idx + 1] = 255;
            cloudData[idx + 2] = 255;
            cloudData[idx + 3] = Math.round(cloudAlpha * 240 * cloudDensitySetting);
          }
        }
      }
    }

    diffuseCtx.putImageData(diffuseImgData, 0, 0);
    bumpCtx.putImageData(bumpImgData, 0, 0);
    specCtx.putImageData(specImgData, 0, 0);
    nightCtx.putImageData(nightImgData, 0, 0);
    cloudCtx.putImageData(cloudImgData, 0, 0);

    const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    const specularMap = new THREE.CanvasTexture(specCanvas);
    const nightLightsMap = new THREE.CanvasTexture(nightCanvas);
    const cloudMap = new THREE.CanvasTexture(cloudCanvas);

    // 2. Generate Rings Map if system has rings
    let ringMap: THREE.CanvasTexture | undefined;
    if (system.hasRings || system.surfaceTextureType === 'gas_giant') {
      const ringCanvas = document.createElement('canvas');
      ringCanvas.width = 512;
      ringCanvas.height = 64;
      const ringCtx = ringCanvas.getContext('2d')!;
      
      const grad = ringCtx.createLinearGradient(0, 0, 512, 0);
      const ringColorHex = system.ringColor || '#e2d9c8';
      const [rr, rg, rb] = hexToRgb(ringColorHex);

      grad.addColorStop(0.0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.15, `rgba(${rr},${rg},${rb},0.65)`);
      grad.addColorStop(0.45, `rgba(${rr},${rg},${rb},0.85)`);
      grad.addColorStop(0.55, 'rgba(0,0,0,0)'); // Cassini division
      grad.addColorStop(0.65, `rgba(${rr},${rg},${rb},0.7)`);
      grad.addColorStop(0.95, `rgba(${rr},${rg},${rb},0.2)`);
      grad.addColorStop(1.0, 'rgba(0,0,0,0)');

      ringCtx.fillStyle = grad;
      ringCtx.fillRect(0, 0, 512, 64);
      ringMap = new THREE.CanvasTexture(ringCanvas);
    }

    const result: GeneratedPlanetMaps = {
      diffuseMap: customDiffuseTexture || diffuseMap,
      bumpMap,
      specularMap,
      nightLightsMap,
      cloudMap,
      ringMap
    };

    this.cache.set(cacheKey, result);
    return result;
  }
}
