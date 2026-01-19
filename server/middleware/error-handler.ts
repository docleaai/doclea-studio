import type { Context, Next } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = "Validation failed",
    details?: unknown,
  ) {
    super(400, message, details);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends ApiError {
  constructor(message = "Database error", details?: unknown) {
    super(500, message, details);
    this.name = "DatabaseError";
  }
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      return c.json(
        {
          error: error.name,
          message: error.message,
          details: error.details,
        },
        error.statusCode as ContentfulStatusCode,
      );
    }

    // Handle Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      return c.json(
        {
          error: "ValidationError",
          message: "Request validation failed",
          details: (error as { issues: unknown[] }).issues,
        },
        400,
      );
    }

    // SQLite errors
    const sqliteError = error as { code?: string };
    if (sqliteError.code?.startsWith("SQLITE_")) {
      return c.json(
        {
          error: "DatabaseError",
          message: "A database error occurred",
        },
        500,
      );
    }

    return c.json(
      {
        error: "InternalServerError",
        message: "An unexpected error occurred",
      },
      500,
    );
  }
}
