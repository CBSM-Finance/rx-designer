export function paintArrow(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  dim: { x: number; y: number }
): void {
  const padY = 3;
  const padX = 2;
  ctx.beginPath();
  ctx.moveTo(pos.x + padX, pos.y + dim.y / 2);
  ctx.lineTo(pos.x + dim.x - padX, pos.y + dim.y / 2);
  const o = 2;
  ctx.moveTo(pos.x + dim.x - padX - o, pos.y + padY);
  ctx.lineTo(pos.x + dim.x - padX, pos.y + dim.y / 2);
  ctx.lineTo(pos.x + dim.x - padX - o, pos.y + dim.y - padY);
  ctx.closePath();
}
