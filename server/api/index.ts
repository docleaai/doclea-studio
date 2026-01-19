import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "../middleware/error-handler";
import memoriesApi from "./memories";
import searchApi from "./search";
import statsApi from "./stats";

const app = new Hono().basePath("/api/v1");

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);
app.use("*", errorHandler);

// Routes
app.route("/memories", memoriesApi);
app.route("/search", searchApi);
app.route("/stats", statsApi);

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
