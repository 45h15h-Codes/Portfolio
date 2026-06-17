"use client";

import { Rect, Ellipse, Line, Text } from "react-konva";
import type { Shape } from "./types";
import type Konva from "konva";

interface Props {
  shape: Shape;
  onSelect: (id: string) => void;
  onChange: (id: string, attrs: Partial<Shape>) => void;
}

export function ShapeNode({ shape, onSelect, onChange }: Props) {
  const commonProps = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    visible: shape.visible,
    draggable: true,
    onClick: () => onSelect(shape.id),
    onTap: () => onSelect(shape.id),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      onChange(shape.id, { x: e.target.x(), y: e.target.y() });
    },
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      onChange(shape.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
      });
      node.scaleX(1);
      node.scaleY(1);
    },
  };

  switch (shape.type) {
    case "rect":
      return (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          cornerRadius={2}
        />
      );
    case "ellipse":
      return (
        <Ellipse
          {...commonProps}
          radiusX={(shape.width ?? 60) / 2}
          radiusY={(shape.height ?? 60) / 2}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
      );
    case "line":
      return (
        <Line
          {...commonProps}
          points={shape.points ?? []}
          stroke={shape.stroke || shape.fill}
          strokeWidth={shape.strokeWidth || 2.5}
          tension={shape.tension ?? 0.4}
          lineCap="round"
          lineJoin="round"
          fill={undefined}
          // lines are not resized the same way — disable transform-end resize for them
          onTransformEnd={undefined}
        />
      );
    case "text":
      return (
        <Text
          {...commonProps}
          text={shape.text ?? "Text"}
          fontSize={shape.fontSize ?? 18}
          fill={shape.fill}
          fontFamily="Inter, sans-serif"
          onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
            const node = e.target as Konva.Text;
            onChange(shape.id, {
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              // for text, scale the fontSize instead of width/height
              fontSize: (shape.fontSize ?? 18) * node.scaleY(),
              width: node.width() * node.scaleX(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    default:
      return null;
  }
}
