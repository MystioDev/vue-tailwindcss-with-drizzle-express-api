const path = require("path");
const dotenv = require("dotenv");
const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");
const schema = require("./schema");

// Load shared .env from project root, with optional local fallback
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASSWORD || "password";
const dbName = process.env.DB_NAME || "express_drizzle_db";

const connectionUrl =
  process.env.DATABASE_URL ||
  `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

const poolConnection = mysql.createPool({
  uri: connectionUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(poolConnection, { schema, mode: "default" });

module.exports = db;
