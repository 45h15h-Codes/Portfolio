export type ShapeType = "rect" | "ellipse" | "line" | "text" | "stamp" | "image";

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  zIndex: number;
  visible: boolean;
  // text only
  text?: string;
  fontSize?: number;
  // line/path only
  points?: number[];
  tension?: number;
  // stamp only
  stampType?: string;
  // image only
  imageSrc?: string;
}

export type ActiveTool = "select" | "rect" | "ellipse" | "line" | "text" | "stamp-star" | "stamp-arrow" | "stamp-barcode";
