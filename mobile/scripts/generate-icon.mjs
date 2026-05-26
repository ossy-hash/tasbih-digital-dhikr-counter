import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets');

if (!existsSync(assetsDir)) {
  mkdirSync(assetsDir, { recursive: true });
}

function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeB = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeB, data]);
  const crcV = Buffer.alloc(4);
  crcV.writeUInt32BE(crc32(crcData));
  return Buffer.concat([len, typeB, data, crcV]);
}

function createPNG(width, height, pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = chunk('IHDR', ihdr);

  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = y * (1 + width * 4) + 1 + x * 4;
      raw[dstIdx] = pixels[srcIdx];
      raw[dstIdx + 1] = pixels[srcIdx + 1];
      raw[dstIdx + 2] = pixels[srcIdx + 2];
      raw[dstIdx + 3] = pixels[srcIdx + 3];
    }
  }
  const compressed = deflateSync(raw);
  const idatChunk = chunk('IDAT', compressed);
  const iendChunk = chunk('IEND', Buffer.alloc(0));
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const S = 1024;
const cx = S / 2;
const cy = S / 2;
const min = (a, b) => a < b ? a : b;
const max = (a, b) => a > b ? a : b;

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const bg = [3, 18, 14, 255];
const beadGold = [212, 175, 55, 255];
const beadLight = [240, 210, 100, 255];
const beadShadow = [140, 110, 30, 255];
const stringColor = [80, 65, 25, 200];

const beadR = S * 0.038;
const orbitR = S * 0.30;
const numBeads = 19;
const tailLen = 3;

function drawBead(px, py, pixels, color, highlight) {
  for (let dy = -beadR - 2; dy <= beadR + 2; dy++) {
    for (let dx = -beadR - 2; dx <= beadR + 2; dx++) {
      const x = Math.round(px + dx);
      const y = Math.round(py + dy);
      if (x < 0 || x >= S || y < 0 || y >= S) continue;
      const d = dist(x, y, px, py);
      if (d > beadR) continue;
      const idx = (y * S + x) * 4;

      const shade = 1 - (d / beadR) * 0.35;
      const hDist = dist(x, y, px - beadR * 0.3, py - beadR * 0.3);
      const hl = max(0, 1 - hDist / (beadR * 0.55));

      pixels[idx] = min(255, Math.round(color[0] * shade + 180 * hl));
      pixels[idx + 1] = min(255, Math.round(color[1] * shade + 160 * hl));
      pixels[idx + 2] = min(255, Math.round(color[2] * shade + 100 * hl));
      pixels[idx + 3] = color[3];
    }
  }
}

function drawLine(x1, y1, x2, y2, pixels) {
  const steps = Math.round(dist(x1, y1, x2, y2) / 2);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(lerp(x1, x2, t));
    const y = Math.round(lerp(y1, y2, t));
    if (x < 0 || x >= S || y < 0 || y >= S) continue;
    const idx = (y * S + x) * 4;
    pixels[idx] = stringColor[0];
    pixels[idx + 1] = stringColor[1];
    pixels[idx + 2] = stringColor[2];
    pixels[idx + 3] = stringColor[3];
  }
}

const pixels = new Uint8Array(S * S * 4);

for (let i = 0; i < pixels.length; i += 4) {
  pixels[i] = bg[0];
  pixels[i + 1] = bg[1];
  pixels[i + 2] = bg[2];
  pixels[i + 3] = bg[3];
}

const angles = [];
for (let i = 0; i < numBeads; i++) {
  const angle = (i / numBeads) * 2 * Math.PI - Math.PI / 2;
  angles.push(angle);
}

for (let i = 0; i < numBeads; i++) {
  const next = (i + 1) % numBeads;
  const x1 = cx + Math.cos(angles[i]) * orbitR;
  const y1 = cy + Math.sin(angles[i]) * orbitR;
  const x2 = cx + Math.cos(angles[next]) * orbitR;
  const y2 = cy + Math.sin(angles[next]) * orbitR;
  drawLine(x1, y1, x2, y2, pixels);
}

const bottomIdx = numBeads - 1;
for (let t = 0; t < tailLen; t++) {
  const angle = angles[bottomIdx] + Math.PI * 0.12;
  const px = cx + Math.cos(angle) * (orbitR + beadR * 1.5 + t * beadR * 2.2);
  const py = cy + Math.sin(angle) * (orbitR + beadR * 1.5 + t * beadR * 2.2);
  const prevPx = t === 0
    ? cx + Math.cos(angles[bottomIdx]) * orbitR
    : cx + Math.cos(angle) * (orbitR + beadR * 1.5 + (t - 1) * beadR * 2.2);
  const prevPy = t === 0
    ? cy + Math.sin(angles[bottomIdx]) * orbitR
    : cy + Math.sin(angle) * (orbitR + beadR * 1.5 + (t - 1) * beadR * 2.2);
  drawLine(prevPx, prevPy, px, py, pixels);
}

for (let i = 0; i < angles.length; i++) {
  const px = cx + Math.cos(angles[i]) * orbitR;
  const py = cy + Math.sin(angles[i]) * orbitR;
  const isTop = i === 0;
  const beadColor = isTop ? [230, 190, 70, 255] : beadGold;
  drawBead(px, py, pixels, beadColor, true);
}

for (let t = 0; t < tailLen; t++) {
  const angle = angles[bottomIdx] + Math.PI * 0.12;
  const px = cx + Math.cos(angle) * (orbitR + beadR * 1.5 + t * beadR * 2.2);
  const py = cy + Math.sin(angle) * (orbitR + beadR * 1.5 + t * beadR * 2.2);
  drawBead(px, py, pixels, beadGold, true);
}

writeFileSync(join(assetsDir, 'icon.png'), createPNG(S, S, pixels));
writeFileSync(join(assetsDir, 'adaptive-icon.png'), createPNG(S, S, pixels));
console.log('Tasbih bead icon generated!');
