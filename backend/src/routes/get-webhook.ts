import { db } from "@/db";
import { webhooksTable } from "@/db/schema";
import { env } from "@/env";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getWebhookRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    `${env.API_ROUTE_PREFIX}/webhooks/:id`,
    {
      schema: {
        summary: "Get Webhook",
        description: "Retrieve a captured webhook by its ID.",
        tags: ["Webhooks"],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: createSelectSchema(webhooksTable),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await db
        .select()
        .from(webhooksTable)
        .where(eq(webhooksTable.id, id))
        .limit(1);

      if (result.length === 0) {
        return reply.status(404).send({ message: "Webhook not found." });
      }

      return reply.status(200).send(result[0]);
    }
  );
};
