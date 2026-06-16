import { useState, useCallback } from "react";
import type { Shape } from "./types";

export function useHistory(initial: Shape[] = []) {
  const [history, setHistory] = useState<Shape[][]>([initial]);
  const [step, setStep] = useState(0);

  const commit = useCallback(
    (newShapes: Shape[]) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, step + 1);
        return [...trimmed, newShapes];
      });
      setStep((s) => s + 1);
    },
    [step]
  );

  const undo = useCallback(
    (setShapes: (s: Shape[]) => void) => {
      setStep((s) => {
        if (s === 0) return s;
        const nextStep = s - 1;
        setHistory((h) => {
          setShapes(h[nextStep]);
          return h;
        });
        return nextStep;
      });
    },
    []
  );

  const redo = useCallback(
    (setShapes: (s: Shape[]) => void) => {
      setStep((s) => {
        setHistory((h) => {
          if (s >= h.length - 1) return h;
          const nextStep = s + 1;
          setShapes(h[nextStep]);
          setStep(nextStep);
          return h;
        });
        return s;
      });
    },
    []
  );

  return { commit, undo, redo, canUndo: step > 0, canRedo: false };
}
