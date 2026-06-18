import { getStroke } from "perfect-freehand";

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );
  d.push("Z");
  return d.join(" ");
}

export function getFreehandPath(points: number[], size: number = 4, style: "brush" | "pen" | "marker" = "brush") {
  if (!points || points.length === 0) return "";
  
  const points2d: number[][] = [];
  for (let i = 0; i < points.length; i += 2) {
    points2d.push([points[i], points[i + 1]]);
  }

  const options = {
    brush: { size, thinning: 0.5, smoothing: 0.5, streamline: 0.5 },
    pen: { size: size * 0.7, thinning: 0, smoothing: 0.8, streamline: 0.8 },
    marker: { size: size * 1.5, thinning: -0.5, smoothing: 0.2, streamline: 0.2 }
  }[style];

  const strokeData = getStroke(points2d, options);

  return getSvgPathFromStroke(strokeData);
}
