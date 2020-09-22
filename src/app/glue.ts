import { fromEvent, merge, Observable, Subject, ReplaySubject } from 'rxjs';
import { tap, map, filter, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import * as math from 'mathjs';
import { designerVars } from './designer/designer-vars';

export interface GlueProps {
  wPx: number;
  wPc: number;
  hPx: number;
  hPc: number;
  xPx: number;
  yPx: number;
  snapToGrid: number;
  label: string[] | string;
  anchor: 'center' | 'topLeft' | 'topRight';
  color: string;
  xOffsetPx: number;
  yOffsetPx: number;
  customPaint: (
    gl: Glue,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => any;
  [key: string]: any;
}

export interface Glue {
  props: GlueProps;
  children: Glue[];
  paint: (canvas: HTMLCanvasElement) => any;
  intersect: (x: number, y: number) => any;
  center: () => { x: number; y: number };
  centerRight: () => { x: number; y: number };
  centerLeft: () => { x: number; y: number };
  query: (label: string) => Glue[];
  cache: {
    pos?: {
      x: number;
      y: number;
    };
    dim?: {
      x: number;
      y: number;
    };
  };
}

export function min(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) };
}

export function max(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) };
}

export function add(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function len(a: { x: number; y: number }) {
  return math.hypot(a.x, a.y);
}

function dot(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: a.x * b.x, y: a.y * b.y };
}

function anyNegatives(a: { x: number; y: number }) {
  return a.x < 0 || a.y < 0;
}

function computeDim(gl: Glue, parent?: Glue): { x: number; y: number } {
  const { wPc, wPx, hPc, hPx } = gl.props;
  const x = wPc === void 0 ? wPx : wPc * parent.cache.dim.x;
  const y = hPc === void 0 ? hPx : hPc * parent.cache.dim.y;
  return (gl.cache.dim = { x, y });
}

function getAnchorOffset(
  anchor: string,
  parent?: Glue
): { x: number; y: number } {
  switch (anchor) {
    case 'center':
      return dot(parent.cache.dim, { x: 0.5, y: 0.5 });
    case 'topRight':
      return dot(parent.cache.dim, { x: 1, y: 0 });
    case 'topLeft':
    default:
      return { x: 0, y: 0 };
  }
}

function snapToGrid(
  pos: { x: number; y: number },
  grid: number
): { x: number; y: number } {
  return {
    x: ~~(pos.x / grid + 0.5) * grid,
    y: ~~(pos.y / grid + 0.5) * grid,
  };
}

function computePos(gl: Glue, parent?: Glue): { x: number; y: number } {
  const anchorOffset = getAnchorOffset(gl.props.anchor, parent);
  const local = add(
    {
      x: gl.props.xPx + gl.props.xOffsetPx,
      y: gl.props.yPx + gl.props.yOffsetPx,
    },
    anchorOffset
  );
  const pos = parent ? add(parent.cache.pos, local) : local;
  if (gl.props.snapToGrid)
    return (gl.cache.pos = snapToGrid(pos, gl.props.snapToGrid));
  return (gl.cache.pos = pos);
}

function hasLabel(gl: Glue, label: string | string[]): boolean {
  const lbl = gl.props.label;
  if (typeof lbl === 'string') {
    if (typeof label === 'string') return lbl === label;
    return label.indexOf(lbl) !== -1;
  }
  if (typeof label === 'string') return lbl.indexOf(label) !== -1;
  return Boolean(label.find((l) => lbl.indexOf(l) !== -1));
}

function paint(gl: Glue, canvas: HTMLCanvasElement, parent?: Glue): void {
  const ctx = canvas.getContext('2d');
  computePos(gl, parent);
  computeDim(gl, parent);

  const { pos, dim } = gl.cache;

  if (gl.props.customPaint) {
    gl.props.customPaint(gl, ctx, canvas);
  } else {
    ctx.beginPath();
    ctx.fillStyle = gl.props.color || 'white';
    ctx.fillRect(pos.x, pos.y, dim.x, dim.y);
    ctx.closePath();
  }

  (gl.children || []).forEach((child) => paint(child, canvas, gl));
}

function intersect(gl: Glue, x: number, y: number): any[] {
  if (anyNegatives(subtract({ x, y }, gl.cache.pos))) return [];
  if (anyNegatives(subtract(add(gl.cache.pos, gl.cache.dim), { x, y })))
    return [];
  const childInt = gl.children.map((child) => intersect(child, x, y));
  return [gl, childInt];
}

function query(gl: Glue, label: string | string[]): Glue[] {
  return gl.children
    .map((child) => query(child, label))
    .flat(1)
    .concat(hasLabel(gl, label) ? [gl] : []);
}

export function glue(props: Partial<GlueProps>, children: Glue[] = []): Glue {
  const gl = {
    props: {
      xPx: 0,
      yPx: 0,
      xOffsetPx: 0,
      yOffsetPx: 0,
      anchor: 'topLeft',
      label: '',
      ...props,
    },
    children,
    paint: (canvas: HTMLCanvasElement): void => paint(gl, canvas),
    intersect: (x: number, y: number) => intersect(gl, x, y),
    query: (label: string | string[]) => query(gl, label),
    center: () => {
      if (!gl.cache.pos || !gl.cache.dim) return { x: 0, y: 0 };
      return add(gl.cache.pos, dot(gl.cache.dim, { x: 0.5, y: 0.5 }));
    },
    centerRight: () => {
      if (!gl.cache.pos || !gl.cache.dim) return { x: 0, y: 0 };
      return add(gl.cache.pos, dot(gl.cache.dim, { x: 1, y: 0.5 }));
    },
    centerLeft: () => {
      if (!gl.cache.pos || !gl.cache.dim) return { x: 0, y: 0 };
      return add(gl.cache.pos, dot(gl.cache.dim, { x: 0, y: 0.5 }));
    },
    cache: {},
  } as Glue;
  return gl;
}

export class MouseEventHandler {
  markForRepaint: Observable<void>;

  private mouseEventConfs = [];

  constructor(canvas: HTMLCanvasElement) {
    const moveRepaint = fromEvent(canvas, 'mousemove').pipe(
      map(
        (ev) =>
          this.mouseEventConfs.filter((conf) => {
            const onMove = conf.callbacks.onMove;
            if (!onMove) return;
            return onMove(ev);
          }).length > 0
      ),
      mapTo(void 0)
    );

    const click = fromEvent(canvas, 'mousedown').pipe(
      switchMap((ev: MouseEvent) =>
        fromEvent(canvas, 'mouseup').pipe(
          filter(
            (ev2: MouseEvent) =>
              len(
                subtract(
                  { x: ev.pageX, y: ev.pageY },
                  { x: ev2.pageX, y: ev2.pageY }
                )
              ) <= 4
          )
        )
      )
    );

    const clickRepaint = click.pipe(
      filter((ev: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return (
          this.mouseEventConfs
            .filter(
              (conf) =>
                (conf.glue as Glue).intersect(
                  ev.pageX - rect.x,
                  ev.pageY - rect.y
                ).length > 0
            )
            .filter((conf) => {
              const onClick = conf.callbacks.onClick;
              if (!onClick) return;
              return onClick(ev);
            }).length > 0
        );
      }),
      mapTo(void 0)
    );

    this.markForRepaint = merge(moveRepaint, clickRepaint);
  }

  register(gl: Glue, callbacks: MouseEventCallbacks) {
    this.mouseEventConfs.push({
      glue: gl,
      callbacks,
    });
  }
}

export class DragHandler {
  markForRepaint: Observable<void>;

  private dragger: Dragger;
  private startOffset: { x: number; y: number };
  private dragMouseStartPos: { x: number; y: number };
  private dragConfs: DragConf[] = [];
  private markForRepaintSub = new Subject<void>();
  private unsub = new Subject<void>();

  unsubscribe() {
    this.unsub.next(void 0);
  }

  constructor(canvas: HTMLCanvasElement) {
    this.markForRepaint = this.markForRepaintSub.asObservable();

    fromEvent(canvas, 'mousedown')
      .pipe(
        map((ev: any) => {
          const rect = canvas.getBoundingClientRect();
          const { translate } = designerVars;
          return {
            x: ev.pageX - rect.x - translate.x,
            y: ev.pageY - rect.y - translate.y,
          };
        }),
        tap(({ x, y }) => {
          const draggers: Dragger[] = this.dragConfs
            .map(
              (conf) =>
                ({ conf, path: conf.glue.intersect(x, y) } as Partial<Dragger>)
            )
            .map((dg) => ({
              ...dg,
              handle: this.getDragHandle(dg.path, dg.conf),
            }))
            .filter((dg) => Boolean(dg.handle))
            .map(
              (dg) => ({ ...dg, ref: dg.conf.callbacks.setRef(dg) } as Dragger)
            );

          if (draggers.length === 0) return;

          this.dragger = draggers[0];
          this.dragMouseStartPos = { x, y };

          const { xOffsetPx, yOffsetPx } = (this.dragger.ref as any).props;
          this.startOffset = { x: xOffsetPx, y: yOffsetPx };
        }),
        takeUntil(this.unsub)
      )
      .subscribe();

    fromEvent(canvas, 'mousemove')
      .pipe(
        filter(() => Boolean(this.dragger)),
        map((ev: any) => {
          const rect = canvas.getBoundingClientRect();
          const { translate } = designerVars;
          return {
            x: ev.pageX - rect.x - translate.x,
            y: ev.pageY - rect.y - translate.y,
          };
        }),
        map((mPos) => subtract(mPos, this.dragMouseStartPos)),
        tap((delta) => {
          const { startOffset } = this;
          this.dragger.conf.callbacks.onMove({
            delta,
            startOffset,
            glue: this.dragger.ref as any,
          });
          this.markForRepaintSub.next();
        }),
        takeUntil(this.unsub)
      )
      .subscribe();

    merge(fromEvent(canvas, 'mouseup'), fromEvent(canvas, 'mouseout'))
      .pipe(
        filter(() => Boolean(this.dragger)),
        tap((ev: MouseEvent) => {
          const onDrop = this.dragger.conf.callbacks.onDrop;
          if (onDrop) onDrop({ event: ev });
          this.dragger = void 0;
        }),
        takeUntil(this.unsub)
      )
      .subscribe();
  }

  private getDragHandle(arr: any[], conf: DragConf): Glue {
    if (!conf.label) return arr[0];
    for (const el of arr) {
      if (Array.isArray(el)) {
        const h = this.getDragHandle(el, conf);
        if (h) return h;
        continue;
      }
      if (hasLabel(el, conf.label)) return el;
    }
    return void 0;
  }

  register(
    gl: Glue,
    callbacks: DragConfCallbacks,
    label: string | string[] = void 0
  ) {
    this.dragConfs.push({
      glue: gl,
      label,
      callbacks,
    });
  }
}

export interface MouseEventCallbacks {
  onMove?: (ev: MouseEvent) => any;
  onClick?: (ev: MouseEvent) => any;
}

export interface DragConfCallbacks {
  setRef: (dg: Partial<Dragger>) => Glue;
  onMove?: DragMoveCallback;
  onDrop?: DragDropCallback;
}

export interface DragConf {
  callbacks: DragConfCallbacks;
  label: string | string[];
  glue: Glue;
}

export type DragDropCallback = (args: { event: MouseEvent }) => any;

export type DragMoveCallback = (args: {
  glue: Glue;
  startOffset: { x: number; y: number };
  delta: { x: number; y: number };
}) => any;

export interface Dragger {
  handle: Glue;
  ref: Glue;
  path: any[];
  conf: DragConf;
}
