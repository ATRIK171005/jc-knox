import { useEffect, useState } from "react";
import { DitheredLogo } from "./ui/dithered-logo";

/**
 * "JC" rendered as a dithered particle field.
 *
 * <DitheredLogo> needs a raster `imageSrc` to sample. Rather than ship a
 * static PNG — which would bake in whatever font the exporter had — the
 * glyphs are drawn to an offscreen canvas in the site's own typeface once
 * the webfont has actually loaded, then handed over as a data URL. The
 * particle field therefore always matches the wordmark.
 *
 * Rendered white-on-black because the component's `invert` default expects
 * the subject to be the BRIGHT region of the source image.
 */
export default function JCLogo({
  className = "",
  text = "JC",
  gridSize = 120,
  cornerRadius = 0.5,
}: {
  className?: string;
  text?: string;
  gridSize?: number;
  /** 0 = square mask, 0.5 = full circle. */
  cornerRadius?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const draw = () => {
      // Render at 2× so the dither grid has pixels to resolve into.
      const S = 1024;
      const cv = document.createElement("canvas");
      cv.width = S;
      cv.height = S;
      const ctx = cv.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, S, S);

      // Draw the glyphs as the BRIGHT subject on black. The component's
      // `invert` default treats bright pixels as the thing to particle-ise,
      // so a filled disc with letters knocked out produced an almost-empty
      // ring instead of a readable mark — draw the letters solid instead.
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const family =
        getComputedStyle(document.documentElement).getPropertyValue(
          "--font-ataero-retina-ob-edition",
        ) || "sans-serif";

      // Fill the frame: the mark is clipped to a circle by CSS, so the
      // glyphs should run close to the edges.
      let size = S * 0.62;
      ctx.font = `700 ${size}px ${family}`;
      const target = S * 0.8;
      const w = ctx.measureText(text).width;
      if (w > target) {
        size = size * (target / w);
        ctx.font = `700 ${size}px ${family}`;
      }

      // Nudge down slightly: cap-height centring reads better than baseline.
      ctx.fillText(text, S / 2, S / 2 + size * 0.02);

      if (!cancelled) setSrc(cv.toDataURL("image/png"));
    };

    // Wait for the webfont, otherwise we'd sample a fallback face.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) draw();
      });
    } else {
      draw();
    }

    return () => {
      cancelled = true;
    };
  }, [text]);

  if (!src) {
    // Reserve the space so the header doesn't reflow when particles appear.
    return <div className={className} aria-label={text} />;
  }

  return (
    <DitheredLogo
      imageSrc={src}
      className={className}
      gridSize={gridSize}
      particleColor="currentColor"
      cornerRadius={cornerRadius}
      aria-label={text}
    />
  );
}
