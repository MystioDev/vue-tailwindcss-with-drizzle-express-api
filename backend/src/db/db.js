const path = require("path");
const dotenv = require("dotenv");
const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");
const schema = require("./schema");

// Load shared .env from project root, with optional local fallback
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const connectionUrl =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || "password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "express_drizzle_db"}`;

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  console.warn(
    "[WARN] DATABASE_URL is not defined in environment variables. Please check your .env file."
  );
}

const poolConnection = mysql.createPool({
  uri: connectionUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(poolConnection, { schema, mode: "default" });

module.exports = db;

