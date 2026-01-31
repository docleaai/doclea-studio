import { join, resolve } from "node:path";

export const config = {
	docleaPath: process.env.DOCLEA_PATH || join(process.cwd(), ".doclea"),
	port: Number.parseInt(process.env.PORT || "5000", 10),
	host: "127.0.0.1", // Localhost only for security
};

export const LOCAL_DB = resolve(config.docleaPath, "local.db");
export const VECTOR_DB = resolve(config.docleaPath, "vectors.db");
