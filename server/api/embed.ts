import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { embeddingService } from "../db/embeddings";

const app = new Hono();

const embedBodySchema = z.object({
  text: z.string().min(1),
});

const embedBatchBodySchema = z.object({
  texts: z.array(z.string().min(1)).min(1).max(100),
});

// POST /embed - Generate embedding for a single text
app.post("/", zValidator("json", embedBodySchema), async (c) => {
  const { text } = c.req.valid("json");

  const embedding = await embeddingService.embed(text);

  return c.json({
    embedding,
    dimensions: embeddingService.getDimensions(),
    model: embeddingService.getModelId(),
  });
});

// POST /embed/batch - Generate embeddings for multiple texts
app.post("/batch", zValidator("json", embedBatchBodySchema), async (c) => {
  const { texts } = c.req.valid("json");

  const embeddings = await embeddingService.embedBatch(texts);

  return c.json({
    embeddings,
    dimensions: embeddingService.getDimensions(),
    model: embeddingService.getModelId(),
  });
});

// GET /embed/info - Get embedding model info
app.get("/info", (c) => {
  return c.json({
    model: embeddingService.getModelId(),
    dimensions: embeddingService.getDimensions(),
  });
});

export default app;
