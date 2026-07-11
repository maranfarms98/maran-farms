import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Phone/LAN: open http://<your-mac-ip>:3000 — not 0.0.0.0
  // Must match the IP you type in the browser, or /_next assets return 403.
  allowedDevOrigins: [
    "192.168.1.12",
    "192.168.1.12:3000",
    "192.168.0.107",
    "192.168.0.107:3000",
    "127.0.0.1",
    "localhost",
    "*.local",
  ],
  images: {
    qualities: [75, 90, 95, 100],
  },
  turbopack: {
    // Absolute project root — avoids picking up /Users/arun/package-lock.json
    root: __dirname,
  },
};

export default nextConfig;
