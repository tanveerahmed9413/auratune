// Copies the MediaPipe wasm runtime from node_modules into /public so the
// runtime version always matches the installed package (no CDN "@latest" drift).
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const from = resolve(root, "node_modules/@mediapipe/tasks-vision/wasm");
const to = resolve(root, "public/mediapipe/wasm");

if (!existsSync(from)) {
  console.warn("[copy-wasm] tasks-vision not installed, skipping");
  process.exit(0);
}
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true });
console.log("[copy-wasm] wasm files copied to public/mediapipe/wasm");
