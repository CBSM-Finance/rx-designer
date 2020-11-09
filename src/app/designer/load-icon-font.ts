declare const FontFace: any;

export function loadIconFont(): Promise<any> {
  const materialFont = new FontFace(
    'material-icons',
    'url(https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2)',
  );
  (document as any).fonts.add(materialFont);
  return materialFont.load();
}
