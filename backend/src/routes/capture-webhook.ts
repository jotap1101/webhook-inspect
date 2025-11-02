import { db } from "@/db";
import { webhooksTable } from "@/db/schema";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  app.all(
    "/capture/*",
    {
      schema: {
        summary: "Capture incoming webhook requests.",
        tags: ["External"],
        hide: true,
        response: {
          201: z.object({ id: z.uuidv7() }),
        },
      },
    },
    async (request, reply) => {
      const method = request.method;
      const pathname = new URL(
        request.url,
        `http://${request.headers.host}`
      ).pathname.replace("/capture", "");
      const ip = request.ip;
      const statusCode = reply.statusCode;
      const contentType = request.headers["content-type"] || null;
      const contentLength = request.headers["content-length"]
        ? parseInt(request.headers["content-length"], 10)
        : null;
      const queryParams = Object.fromEntries(
        Object.entries(request.query as Record<string, string>).map(
          ([key, value]) => [
            key,
            Array.isArray(value) ? value.join(", ") : value || "",
          ]
        )
      );
      const headers = Object.fromEntries(
        Object.entries(request.headers as Record<string, string>).map(
          ([key, value]) => [
            key,
            Array.isArray(value) ? value.join(", ") : value || "",
          ]
        )
      );
      let body: string | null = null;

      if (request.body) {
        body =
          typeof request.body === "string"
            ? request.body
            : JSON.stringify(request.body, null, 2);
      }

      const result = await db
        .insert(webhooksTable)
        .values({
          method,
          pathname,
          ip,
          statusCode,
          contentType,
          contentLength,
          queryParams,
          headers,
          body,
        })
        .returning();

      return reply.status(201).send({
        id: result[0].id,
      });
    }
  );
};
