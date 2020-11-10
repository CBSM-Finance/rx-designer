import { ɵangular_packages_platform_browser_platform_browser_j } from '@angular/platform-browser';

export enum Font {
  ROBOTO_400,
}

export function vertCenteredText(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  ctx: CanvasRenderingContext2D,
  font = Font.ROBOTO_400,
) {
  ctx.textBaseline = 'hanging';
  let capHeightRatio: number;
  let fontStr: string;

  switch (font) {
    case Font.ROBOTO_400:
      fontStr = `400 ${fontSize}px Roboto`;
      capHeightRatio = 0.71;
      break;
  }

  ctx.font = fontStr;
  const textY = y + (fontSize * capHeightRatio) / 2;
  ctx.fillText(text, x, textY);

}
