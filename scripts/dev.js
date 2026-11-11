const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// Load .env configuration from root so dev runner knows active ports
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const backendPort = process.env.BACKEND_PORT || "3000";
const frontendPort = process.env.FRONTEND_PORT || "5173";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || "3306";

console.log("==================================================");
console.log("🚀 Starting Full-Stack Development Environment");
console.log(`   • Express API:   http://localhost:${backendPort}`);
console.log(`   • Vite Frontend: http://localhost:${frontendPort}`);
console.log(`   • MySQL Host:    ${dbHost}:${dbPort}`);
console.log("==================================================");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const backend = spawn(npmCmd, ["run", "dev"], {
  cwd: "./backend",
  stdio: "inherit",
});

const frontend = spawn(npmCmd, ["run", "dev"], {
  cwd: "./frontend",
  stdio: "inherit",
});

const cleanup = () => {
  console.log("\n🛑 Stopping servers...");
  try {
    backend.kill();
    frontend.kill();
  } catch {}
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

backend.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Backend] Process exited with code ${code}`);
  }
});

frontend.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Frontend] Process exited with code ${code}`);
  }
});
