import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { env, pipeline } from "@huggingface/transformers";

/**
 * Supported embedding models
 */
export const EMBEDDING_MODELS = {
  "mxbai-embed-xsmall-v1": {
    id: "mixedbread-ai/mxbai-embed-xsmall-v1",
    dimensions: 384,
  },
  "all-MiniLM-L6-v2": {
    id: "Xenova/all-MiniLM-L6-v2",
    dimensions: 384,
  },
} as const;

type ModelName = keyof typeof EMBEDDING_MODELS;

// Cache directory for model downloads
function getCacheDir(): string {
  const xdgCache = process.env.XDG_CACHE_HOME;
  const baseDir = xdgCache || join(homedir(), ".cache");
  return join(baseDir, "doclea", "transformers");
}

interface FeatureExtractionOutput {
  data: Float32Array;
  dims: number[];
}

type FeatureExtractionPipeline = (
  texts: string | string[],
  options?: { pooling?: string; normalize?: boolean },
) => Promise<FeatureExtractionOutput>;

/**
 * Embedding service using local Transformers.js
 * Singleton pattern for efficient model reuse
 */
class EmbeddingService {
  private extractor: FeatureExtractionPipeline | null = null;
  private modelId: string;
  private modelDimensions: number;
  private cacheDir: string;
  private initPromise: Promise<void> | null = null;

  constructor(modelName: ModelName = "mxbai-embed-xsmall-v1") {
    const modelInfo = EMBEDDING_MODELS[modelName];
    this.modelId = modelInfo.id;
    this.modelDimensions = modelInfo.dimensions;
    this.cacheDir = getCacheDir();
  }

  private async initialize(): Promise<void> {
    if (this.extractor) return;

    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this.doInitialize();
    await this.initPromise;
  }

  private async doInitialize(): Promise<void> {
    // Ensure cache directory exists
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }

    // Configure environment
    env.cacheDir = this.cacheDir;

    console.log(`[embedding] Loading model: ${this.modelId}`);
    const startTime = Date.now();

    // Create pipeline
    this.extractor = (await pipeline("feature-extraction", this.modelId, {
      progress_callback: (progress: { status: string; file?: string; progress?: number }) => {
        if (progress.status === "downloading" && progress.file) {
          const pct = progress.progress?.toFixed(1) ?? "?";
          process.stderr.write(`\r[embedding] Downloading ${progress.file}: ${pct}%`);
        } else if (progress.status === "done" && progress.file) {
          process.stderr.write(`\r[embedding] Downloaded ${progress.file}        \n`);
        }
      },
    })) as unknown as FeatureExtractionPipeline;

    console.log(`[embedding] Model loaded in ${Date.now() - startTime}ms`);
  }

  async embed(text: string): Promise<number[]> {
    await this.initialize();

    if (!this.extractor) {
      throw new Error("Embedding pipeline not initialized");
    }

    const output = await this.extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data as Float32Array);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    await this.initialize();

    if (!this.extractor) {
      throw new Error("Embedding pipeline not initialized");
    }

    if (texts.length === 0) {
      return [];
    }

    const output = await this.extractor(texts, {
      pooling: "mean",
      normalize: true,
    });

    const data = output.data as Float32Array;
    const embeddingDim = output.dims[1];
    const results: number[][] = [];

    for (let i = 0; i < texts.length; i++) {
      const start = i * embeddingDim;
      const end = start + embeddingDim;
      results.push(Array.from(data.slice(start, end)));
    }

    return results;
  }

  getDimensions(): number {
    return this.modelDimensions;
  }

  getModelId(): string {
    return this.modelId;
  }
}

// Singleton instance
export const embeddingService = new EmbeddingService();
