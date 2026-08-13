/**
 * Prints which env/DB is active, then starts `next dev`.
 * Env vars must already be loaded (via dotenv-cli in package.json scripts).
 */
import { spawn } from "node:child_process";
import { networkInterfaces } from "node:os";

const appEnv = process.env.APP_ENV || "local";
let dbHost = "not set";
try {
  dbHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname || "not set";
} catch {
  dbHost = "invalid NEXT_PUBLIC_SUPABASE_URL";
}

const lan = Object.values(networkInterfaces())
  .flat()
  .find((iface) => iface.family === "IPv4" && !iface.internal);

console.log(`\n  → Env: ${appEnv}  DB: ${dbHost}`);
if (lan) {
  console.log(`  → Phone/LAN: http://${lan.address}:3000\n`);
} else {
  console.log("");
}

const child = spawn("next", ["dev", "--hostname", "0.0.0.0"], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
