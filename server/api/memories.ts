import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { memoryRepository } from "../db/memories";

const app = new Hono();

const listQuerySchema = z.object({
  type: z
    .enum(["decision", "solution", "pattern", "architecture", "note"])
    .optional(),
  tags: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",") : undefined)),
  sort: z.enum(["created", "accessed", "importance", "title"]).default("created"),
  order: z.enum(["asc", "desc"]).default("desc"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
});

const memoryTypeSchema = z.enum([
  "decision",
  "solution",
  "pattern",
  "architecture",
  "note",
]);

const createBodySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500),
  type: memoryTypeSchema,
  content: z.string().min(1),
  summary: z.string().nullable().default(null),
  importance: z.number().min(0).max(1).default(0.5),
  tags: z.array(z.string()).default([]),
  related_files: z.array(z.string()).default([]),
});

const updateBodySchema = z.object({
  title: z.string().min(1).max(500).optional(),
  type: memoryTypeSchema.optional(),
  content: z.string().min(1).optional(),
  summary: z.string().nullable().optional(),
  importance: z.number().min(0).max(1).optional(),
  tags: z.array(z.string()).optional(),
  related_files: z.array(z.string()).optional(),
  needs_review: z.boolean().optional(),
});

// GET /memories - List with filters and pagination
app.get("/", zValidator("query", listQuerySchema), (c) => {
  const params = c.req.valid("query");
  const result = memoryRepository.list(params);
  return c.json(result);
});

// POST /memories - Create memory
app.post("/", zValidator("json", createBodySchema), (c) => {
  const data = c.req.valid("json");
  const memory = memoryRepository.create(data);
  return c.json(memory, 201);
});

// GET /memories/:id - Get memory by ID
app.get("/:id", (c) => {
  const id = c.req.param("id");
  const memory = memoryRepository.getById(id);
  return c.json(memory);
});

// PATCH /memories/:id - Update memory
app.patch("/:id", zValidator("json", updateBodySchema), (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const memory = memoryRepository.update(id, data);
  return c.json(memory);
});

// DELETE /memories/:id - Delete memory
app.delete("/:id", (c) => {
  const id = c.req.param("id");
  memoryRepository.delete(id);
  return c.body(null, 204);
});

export default app;
