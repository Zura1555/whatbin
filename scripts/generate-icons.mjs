import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../app/public');

// 1. Generate SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#grad)"/>
  <!-- Stylized W / Recycling mark -->
  <g fill="#ffffff">
    <path d="M128 152 L188 356 L238 212 L274 212 L324 356 L384 152 L332 152 L298 284 L260 168 L252 168 L214 284 L180 152 Z"/>
    <!-- Organic leaf accent -->
    <path d="M256 360 C236 385 240 415 256 424 C272 415 276 385 256 360 Z" fill="#86efac"/>
  </g>
</svg>
`;

writeFileSync(resolve(publicDir, 'icon.svg'), svgContent, 'utf8');
console.log('Wrote icon.svg');

// 2. Generate PNG with pure Node.js (zlib)
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function renderWhatBinIcon(size) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rowSize = 1 + size * 4;
  const raw = Buffer.alloc(size * rowSize);
  const cornerRadius = size * 0.22;

  // Render pixels
  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // filter None
    for (let x = 0; x < size; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Rounded rectangle test
      let inBounds = true;
      const dx = Math.min(x, size - 1 - x);
      const dy = Math.min(y, size - 1 - y);
      if (dx < cornerRadius && dy < cornerRadius) {
        const dist = Math.hypot(cornerRadius - dx, cornerRadius - dy);
        if (dist > cornerRadius) {
          inBounds = false;
        }
      }

      if (!inBounds) {
        raw[pxOffset] = 0;
        raw[pxOffset + 1] = 0;
        raw[pxOffset + 2] = 0;
        raw[pxOffset + 3] = 0;
        continue;
      }

      // Background green gradient (#16a34a -> #15803d)
      const gradT = (x + y) / (size * 2);
      const bgR = Math.round(22 - gradT * 1);
      const bgG = Math.round(163 - gradT * 35);
      const bgB = Math.round(74 - gradT * 13);

      // Normalized coordinates [0, 1]
      const nx = x / size;
      const ny = y / size;

      // Draw stylized "W"
      // W strokes:
      // Left down: (0.25, 0.30) to (0.37, 0.70)
      // Left up: (0.37, 0.70) to (0.47, 0.42)
      // Right down: (0.53, 0.42) to (0.63, 0.70)
      // Right up: (0.63, 0.70) to (0.75, 0.30)
      function distToSegment(px, py, x1, y1, x2, y2) {
        const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        if (l2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
      }

      const strokeW = 0.055;
      const d1 = distToSegment(nx, ny, 0.25, 0.30, 0.37, 0.68);
      const d2 = distToSegment(nx, ny, 0.37, 0.68, 0.47, 0.42);
      const d3 = distToSegment(nx, ny, 0.47, 0.42, 0.53, 0.42);
      const d4 = distToSegment(nx, ny, 0.53, 0.42, 0.63, 0.68);
      const d5 = distToSegment(nx, ny, 0.63, 0.68, 0.75, 0.30);
      const minD = Math.min(d1, d2, d3, d4, d5);

      // Leaf dot below center
      const leafDist = Math.hypot(nx - 0.5, ny - 0.78);

      if (minD <= strokeW) {
        // Antialiased white stroke
        const edge = (strokeW - minD) * size;
        const alpha = Math.min(1, Math.max(0, edge + 0.5));
        raw[pxOffset] = Math.round(255 * alpha + bgR * (1 - alpha));
        raw[pxOffset + 1] = Math.round(255 * alpha + bgG * (1 - alpha));
        raw[pxOffset + 2] = Math.round(255 * alpha + bgB * (1 - alpha));
        raw[pxOffset + 3] = 255;
      } else if (leafDist <= 0.045) {
        // Leaf accent color #86efac (134, 239, 172)
        raw[pxOffset] = 134;
        raw[pxOffset + 1] = 239;
        raw[pxOffset + 2] = 172;
        raw[pxOffset + 3] = 255;
      } else {
        raw[pxOffset] = bgR;
        raw[pxOffset + 1] = bgG;
        raw[pxOffset + 2] = bgB;
        raw[pxOffset + 3] = 255;
      }
    }
  }

  const idatData = zlib.deflateSync(raw);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const png192 = renderWhatBinIcon(192);
writeFileSync(resolve(publicDir, 'icon-192.png'), png192);
console.log('Wrote icon-192.png, bytes:', png192.length);

const png512 = renderWhatBinIcon(512);
writeFileSync(resolve(publicDir, 'icon-512.png'), png512);
console.log('Wrote icon-512.png, bytes:', png512.length);
