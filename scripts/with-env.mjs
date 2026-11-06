/**
 * Load `.env` then run a command.
 * Fails if the env file is missing (unlike dotenv-cli, which continues).
 *
 *   node scripts/with-env.mjs node scripts/seed-supabase.mjs
 */
import { spawn } from "node:child_process";
import { loadProjectEnv } from "./lib/catalog-storage.mjs";

const [cmd, ...cmdArgs] = process.argv.slice(2);

if (!cmd) {
  console.error("Usage: node scripts/with-env.mjs <command...>");
  process.exit(1);
}

try {
  loadProjectEnv();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const child = spawn(cmd, cmdArgs, {
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
