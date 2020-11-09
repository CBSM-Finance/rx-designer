export function paintX(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  dim: { x: number; y: number }
): void {
  const pad = 1;
  ctx.beginPath();
  ctx.moveTo(pos.x + pad, pos.y + pad);
  ctx.lineTo(pos.x + dim.x - pad, pos.y + dim.y - pad);
  ctx.moveTo(pos.x + dim.x - pad, pos.y + pad);
  ctx.lineTo(pos.x + +pad, pos.y + dim.y - pad);
  ctx.closePath();
}
