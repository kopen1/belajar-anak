function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const number = Number.parseInt(full, 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

export function floodFill(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  hexColor: string,
  tolerance = 64,
): boolean {
  const canvas = context.canvas;
  const startX = Math.floor(x);
  const startY = Math.floor(y);
  if (startX < 0 || startY < 0 || startX >= canvas.width || startY >= canvas.height) return false;

  const { width, height } = canvas;
  const image = context.getImageData(0, 0, width, height);
  const data = image.data;
  const startIndex = (startY * width + startX) * 4;
  const targetR = data[startIndex];
  const targetG = data[startIndex + 1];
  const targetB = data[startIndex + 2];
  const targetA = data[startIndex + 3];
  const [fillR, fillG, fillB] = hexToRgb(hexColor);

  if (
    targetA === 255 &&
    Math.abs(targetR - fillR) + Math.abs(targetG - fillG) + Math.abs(targetB - fillB) < 10
  ) {
    return false;
  }

  const matches = (index: number) =>
    Math.abs(data[index] - targetR) <= tolerance &&
    Math.abs(data[index + 1] - targetG) <= tolerance &&
    Math.abs(data[index + 2] - targetB) <= tolerance &&
    Math.abs(data[index + 3] - targetA) <= tolerance;

  const visited = new Uint8Array(width * height);
  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const py = stack.pop()!;
    const px = stack.pop()!;
    if (px < 0 || py < 0 || px >= width || py >= height) continue;
    const cell = py * width + px;
    if (visited[cell]) continue;
    visited[cell] = 1;
    const index = cell * 4;
    if (!matches(index)) continue;
    data[index] = fillR;
    data[index + 1] = fillG;
    data[index + 2] = fillB;
    data[index + 3] = 255;
    stack.push(px + 1, py, px - 1, py, px, py + 1, px, py - 1);
  }

  context.putImageData(image, 0, 0);
  return true;
}
