"use client";

import { useState, useEffect } from "react";
import { Rect, Ellipse, Path, Text, Image as KonvaImage } from "react-konva";
import type { Shape } from "./types";
import type Konva from "konva";
import { getFreehandPath } from "@/lib/freehand";
import { STAMPS, STAMP_SIZE } from "@/lib/stamps";

function useImage(url: string | undefined) {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = url;
  }, [url]);
  return image;
}

interface Props {
  shape: Shape;
  onSelect: (id: string) => void;
  onChange: (id: string, attrs: Partial<Shape>) => void;
}

export function ShapeNode({ shape, onSelect, onChange }: Props) {
  const imageObj = useImage(shape.type === "image" ? shape.imageSrc : undefined);

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
        width: Math.max(5, Math.abs(node.width() * node.scaleX())),
        height: Math.max(5, Math.abs(node.height() * node.scaleY())),
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
        <Path
          {...commonProps}
          data={getFreehandPath(shape.points ?? [], shape.strokeWidth || 4)}
          fill={shape.stroke || shape.fill}
          // no stroke because the path itself is a filled polygon
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
    case "stamp":
      return (
        <Path
          {...commonProps}
          data={STAMPS[shape.stampType ?? "star"]}
          fill={shape.fill}
          scaleX={shape.width / STAMP_SIZE}
          scaleY={shape.height / STAMP_SIZE}
          onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
            const node = e.target;
            onChange(shape.id, {
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: Math.max(5, Math.abs(STAMP_SIZE * node.scaleX())),
              height: Math.max(5, Math.abs(STAMP_SIZE * node.scaleY())),
            });
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
      );
    case "image":
      if (!imageObj) return null;
      return (
        <KonvaImage
          {...commonProps}
          image={imageObj}
          width={shape.width}
          height={shape.height}
        />
      );
    default:
      return null;
  }
}
