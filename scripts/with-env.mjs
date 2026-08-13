/**
 * Load `.env.<staging|production>` then run a command.
 * Fails if the env file is missing (unlike dotenv-cli, which continues).
 *
 *   node scripts/with-env.mjs staging node scripts/seed-supabase.mjs
 */
import { spawn } from "node:child_process";
import { loadNamedEnv } from "./lib/catalog-storage.mjs";

const name = process.argv[2];
const [cmd, ...cmdArgs] = process.argv.slice(3);

if (!cmd) {
  console.error("Usage: node scripts/with-env.mjs <staging|production> <command...>");
  process.exit(1);
}

try {
  loadNamedEnv(name);
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
