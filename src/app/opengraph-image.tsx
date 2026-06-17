import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ashish Vala | Full Stack Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width="300"
        height="300"
      >
        <g
          stroke="#f5f5f5"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Number 4 */}
          <path d="M 110 60 L 110 196 M 110 60 L 40 150 L 130 150" />
          {/* Number 5 */}
          <path d="M 216 60 L 150 60 L 140 120 C 180 110, 220 130, 220 165 C 220 205, 176 216, 144 186" />
        </g>
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
