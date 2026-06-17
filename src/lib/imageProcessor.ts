export async function processImageBrutalist(file: File, darkColor: string, lightColor: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");

      // Scale down image if it's too big
      const MAX_WIDTH = 800;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const hexToRgb = (hex: string) => {
        if (!hex || hex === "transparent") return [128, 128, 128];
        let c = hex.replace("#", "");
        if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        return [
          parseInt(c.substring(0, 2), 16) || 0,
          parseInt(c.substring(2, 4), 16) || 0,
          parseInt(c.substring(4, 6), 16) || 0,
        ];
      };

      const darkRgb = hexToRgb(darkColor);
      const lightRgb = hexToRgb(lightColor);

      // Apply threshold duotone + simple halftone effect
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const a = data[i + 3];

          if (a < 10) continue; // skip transparent

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          
          // Introduce a bit of halftone pattern by modulating threshold based on grid
          const threshold = 127 + ((x % 2 === 0 ? 1 : -1) * (y % 2 === 0 ? 1 : -1) * 20);
          
          const useDark = brightness < threshold;
          const targetColor = useDark ? darkRgb : lightRgb;

          data[i] = targetColor[0];
          data[i + 1] = targetColor[1];
          data[i + 2] = targetColor[2];
          data[i + 3] = 255; // force opaque
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject("Image load failed");
    img.src = url;
  });
}
