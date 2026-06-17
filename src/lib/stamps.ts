export const STAMPS: Record<string, string> = {
  star: "M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z",
  arrow: "M20 50 L60 10 L60 30 L100 30 L100 70 L60 70 L60 90 Z",
  xmark: "M10 20 L20 10 L50 40 L80 10 L90 20 L60 50 L90 80 L80 90 L50 60 L20 90 L10 80 L40 50 Z",
  barcode: "M10 10 h10 v80 h-10 Z M25 10 h5 v80 h-5 Z M35 10 h15 v80 h-15 Z M55 10 h5 v80 h-5 Z M65 10 h10 v80 h-10 Z M80 10 h15 v80 h-15 Z",
};

// All stamps are designed to fit within a 100x100 viewBox
export const STAMP_SIZE = 100;
