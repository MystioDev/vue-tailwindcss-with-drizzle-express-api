const { spawn } = require("child_process");

console.log("==================================================");
console.log("🚀 Starting Full-Stack Development Environment");
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
