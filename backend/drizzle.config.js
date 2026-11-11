const path = require("path");
const dotenv = require("dotenv");
const { defineConfig } = require("drizzle-kit");

// Load shared .env from project root, with optional local fallback
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const dbUrl =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || "password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "express_drizzle_db"}`;

module.exports = defineConfig({
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: dbUrl,
  },
});

