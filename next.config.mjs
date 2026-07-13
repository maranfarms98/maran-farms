import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Phone/LAN: open http://<your-mac-ip>:3000 — not 0.0.0.0
  // Wildcard covers any 192.168.x.x address without hardcoding IPs.
  allowedDevOrigins: ["192.168.*.*", "127.0.0.1"],
  images: {
    qualities: [75, 90, 95, 100],
  },
  turbopack: {
    // Absolute project root — avoids picking up /Users/arun/package-lock.json
    root: __dirname,
  },
};

export default nextConfig;
