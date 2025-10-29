import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_ROUTE_PREFIX: z.string().default("/api/v1"),
});

export const env = envSchema.parse(process.env);
