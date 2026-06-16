import type { Metadata } from "next";
import EditorClient from "./EditorClient";

export const metadata: Metadata = {
  title: "Design Editor | Ashish",
  description: "Canvas-based design editor — shapes, layers, undo/redo, and PNG export.",
};

export default function EditorPage() {
  return <EditorClient />;
}
