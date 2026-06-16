export type ShapeType = "rect" | "ellipse" | "line" | "text";

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
}

export type ActiveTool = "select" | ShapeType;
