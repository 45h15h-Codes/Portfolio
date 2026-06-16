"use client";

import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";
import type Konva from "konva";

interface Props {
  selectedId: string | null;
  stageRef: React.RefObject<Konva.Stage | null>;
}

export function SelectionTransformer({ selectedId, stageRef }: Props) {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;
    if (!selectedId) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = stageRef.current.findOne(`#${selectedId}`);
    if (node) {
      trRef.current.nodes([node as Konva.Node]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, stageRef]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled
      keepRatio={false}
      boundBoxFunc={(oldBox, newBox) => {
        // Prevent collapsing too small
        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
}
