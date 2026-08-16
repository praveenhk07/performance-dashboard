/**
 * Scales canvas buffer for High DPI / Retina displays to prevent blurriness.
 */
export function setupCanvasDPI(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null {
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.scale(dpr, dpr);
  return ctx;
}

/**
 * Fast direct-canvas rendering engine using TypedArrays.
 */
export function drawLineChart(
  ctx: CanvasRenderingContext2D,
  data: Float64Array,
  width: number,
  height: number,
  minVal: number,
  maxVal: number
): void {
  ctx.fillStyle = "#09090b";
  ctx.fillRect(0, 0, width, height);

  const totalPoints = data.length / 2;
  if (totalPoints < 2) return;

  const padding = 20;
  const drawWidth = width - padding * 2;
  const drawHeight = height - padding * 2;
  const valRange = maxVal - minVal || 1;

  ctx.beginPath();
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 1.5;

  for (let i = 0; i < totalPoints; i++) {
    const val = data[i * 2 + 1];
    const x = padding + (i / (totalPoints - 1)) * drawWidth;
    const y = height - padding - ((val - minVal) / valRange) * drawHeight;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}