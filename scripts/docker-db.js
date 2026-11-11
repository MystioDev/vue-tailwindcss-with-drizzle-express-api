const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load .env configuration
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const action = process.argv[2] || "push";
const projectName = process.env.PROJECT_NAME || "fullstack";
process.env.PROJECT_NAME = projectName;

const isWin = process.platform === "win32";
const dockerCmd = isWin ? "docker.exe" : "docker";

console.log(`[Docker DB] Target project: "${projectName}" | Action: "${action}"`);

// Check if the backend container is currently running
const checkRunning = spawnSync(
  dockerCmd,
  ["compose", "ps", "--status", "running", "-q", "backend"],
  {
    encoding: "utf-8",
    env: process.env,
  }
);

const isBackendRunning = Boolean(
  checkRunning.stdout && checkRunning.stdout.trim()
);

let result;
if (action === "sh") {
  if (isBackendRunning) {
    result = spawnSync(dockerCmd, ["compose", "exec", "backend", "sh"], {
      stdio: "inherit",
      env: process.env,
    });
  } else {
    result = spawnSync(
      dockerCmd,
      ["compose", "run", "--rm", "backend", "sh"],
      {
        stdio: "inherit",
        env: process.env,
      }
    );
  }
} else {
  const npmScript = `db:${action}`;
  if (isBackendRunning) {
    console.log(`[Docker DB] Executing inside running "${projectName}-backend" container...`);
    result = spawnSync(
      dockerCmd,
      ["compose", "exec", "backend", "npm", "run", npmScript],
      {
        stdio: "inherit",
        env: process.env,
      }
    );
  } else {
    console.log(
      `[Docker DB] Backend container is not running. Starting one-off container on "${projectName}_app-network"...`
    );
    result = spawnSync(
      dockerCmd,
      ["compose", "run", "--rm", "backend", "npm", "run", npmScript],
      {
        stdio: "inherit",
        env: process.env,
      }
    );
  }
}

if (result.error) {
  console.error(`[Docker DB] Error executing docker command:`, result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
