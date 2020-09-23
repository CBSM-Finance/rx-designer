export function paintArrow(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number },
  dim: { x: number; y: number }
): void {
  const pad = 1;
  pos = { x: pos.x + pad, y: pos.y + pad };
  dim = { x: dim.x - pad * 2, y: dim.y - pad * 2 };

  ctx.beginPath();
  ctx.moveTo(pad + pos.x, pos.y + dim.y / 2);
  ctx.lineTo(pos.x + dim.x, pos.y + dim.y / 2);

  ctx.moveTo(pad + pos.x + dim.x / 2, pad + pos.y);
  ctx.lineTo(pos.x + dim.x, pos.y + dim.y / 2);

  ctx.moveTo(pad + pos.x + dim.x / 2, pos.y + dim.y);
  ctx.lineTo(pos.x + dim.x, pos.y + dim.y / 2);

  ctx.closePath();


  // const padY = 3;
  // const padX = 2;
  // ctx.beginPath();
  // ctx.moveTo(pos.x + padX, pos.y + dim.y / 2);
  // ctx.lineTo(pos.x + dim.x - padX, pos.y + dim.y / 2);
  // const o = 2;
  // ctx.moveTo(pos.x + dim.x - padX - o, pos.y + padY);
  // ctx.lineTo(pos.x + dim.x - padX, pos.y + dim.y / 2);
  // ctx.lineTo(pos.x + dim.x - padX - o, pos.y + dim.y - padY);
  // ctx.closePath();
}
